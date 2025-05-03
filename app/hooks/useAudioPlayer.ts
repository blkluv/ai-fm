// hooks/useAudioPlayer.ts
import {useEffect, useRef, useState} from 'react';
import {RadioState} from '~/types';

export const useAudioPlayer = (radioState: RadioState | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element if it doesn't exist
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onwaiting = () => setIsLoading(true);
      audioRef.current.oncanplay = () => setIsLoading(false);
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio');
        setIsLoading(false);
      };
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update audio source when stream URL changes
  useEffect(() => {
    if (!radioState || !audioRef.current) return;

    const isCurrentlyPlaying = !audioRef.current.paused;

    // If we have a new block or the stream URL has changed
    if (radioState.block?.streamUrl) {
      const newUrl = radioState.block.streamUrl;

      // Only update if URL is different
      // Handle both relative and absolute URLs, using the backend server
      const fullUrl = newUrl.startsWith('http') 
        ? newUrl 
        : `http://localhost:5000${newUrl}`;
        
      if (audioRef.current.src !== fullUrl) {
        setIsLoading(true);

        // Save current playing state
        // Ensure we're using the full URL pointing to the backend
        audioRef.current.src = newUrl.startsWith('http') 
          ? newUrl 
          : `http://localhost:5000${newUrl}`;

        // If we were playing before, continue playing with new source
        if (isCurrentlyPlaying || radioState.playState ===
          'playing') {
          audioRef.current.play().catch(err => {
            console.error('Failed to play audio:', err);
            setError('Failed to play audio');
            setIsLoading(false);
          });
        }
      }
    }

    // Handle play state from server
    if (radioState.playState === 'playing' &&
      !isCurrentlyPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play audio:', err);
        setError('Failed to play audio');
      });
    } else if (radioState.playState === 'paused' &&
      isCurrentlyPlaying) {
      audioRef.current.pause();
    }

    // Handle loading state
    if (radioState.playState === 'loading') {
      setIsLoading(true);
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [radioState]);

  // Play/pause controls
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play audio:', err);
        setError('Failed to play audio');
      });
    } else {
      audioRef.current.pause();
    }
  };

  // Error handling for 404 and other HTTP errors
  const handleStreamError = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          // Audio still being downloaded or generated
          setError('Audio is being prepared. Please wait...');
          // Try again in 3 seconds
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.load();
              if (isPlaying) {
                audioRef.current.play().catch(console.error);
              }
            }
          }, 3000);
        } else {
          setError(`Server error: ${response.status}`);
        }
      }
    } catch (err) {
      console.error('Stream error check failed:', err);
    }
  };

  // Check for stream errors when loading
  useEffect(() => {
    if (isLoading && audioRef.current?.src) {
      handleStreamError(audioRef.current.src);
    }
  }, [isLoading]);

  return {
    isPlaying,
    isLoading,
    error,
    togglePlay,
  };
};
