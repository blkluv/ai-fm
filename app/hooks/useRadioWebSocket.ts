// hooks/useRadioWebSocket.ts
import {useCallback, useEffect, useRef, useState} from 'react';
import {RadioState} from '~/types';

export const useRadioWebSocket = (radioId: string) => {
  const [radioState, setRadioState] = useState<RadioState |
    null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Reconnection logic
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Clear any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      // Connect to the backend server (localhost:5000)
      const wsUrl = `ws://localhost:5000/ws/radio/${radioId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Request current state
        ws.send(JSON.stringify({
          type: 'command',
          command: 'get_current_state'
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'state_update') {
            setRadioState(data.data);
          } else if (data.type === 'connection_established') {
            console.log('Connection established with radio',
              data.radioId);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:',
            err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error occurred');
      };

      ws.onclose = () => {
        setIsConnected(false);

        // Handle reconnection
        if (reconnectAttemptsRef.current <
          MAX_RECONNECT_ATTEMPTS) {
          const timeout = Math.min(1000 * 2 **
            reconnectAttemptsRef.current, 30000);
          console.log(`WebSocket closed. Reconnecting in
${timeout}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connectWebSocket();
          }, timeout);
        } else {
          setError('Connection lost. Please refresh the page.');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError('Failed to connect to radio');
    }
  }, [radioId]);

  // Send command to server
  const sendCommand = useCallback((command: 'next' |
    'previous' | 'get_current_state') => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'command',
        command
      }));
    } else {
      setError('Not connected to server');
      // Try to reconnect
      connectWebSocket();
    }
  }, [connectWebSocket]);

  // Connect when component mounts
  useEffect(() => {
    connectWebSocket();

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket, radioId]);

  return {
    radioState,
    isConnected,
    error,
    sendCommand,
    skipNext: () => sendCommand('next'),
    skipPrevious: () => sendCommand('previous'),
    refreshState: () => sendCommand('get_current_state')
  };
};
