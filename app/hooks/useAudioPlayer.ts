// hooks/useAudioPlayer.ts
import {useEffect, useRef, useState} from 'react';
import {RadioState} from '~/types';

// Constants for error handling
const ERROR_TIMEOUT_MS = 8000; // 8 seconds to wait before skipping
const MAX_RETRY_ATTEMPTS = 2;

export const useAudioPlayer = (
  radioState: RadioState | null, 
  skipNext?: () => void
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayAfterSkipRef = useRef(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryAttemptsRef = useRef(0);
  const currentTrackIdRef = useRef<string | null>(null);

  // Function to clear loading timeout
  const clearLoadTimeout = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  };

  // Function to handle skipping to next track after error
  const handleAutoSkip = () => {
    console.log("Auto-skipping due to loading timeout or error");
    clearLoadTimeout();
    
    if (skipNext && radioState?.hasNext !== false) {
      setError('Track failed to load - skipping to next track');
      autoPlayAfterSkipRef.current = true;
      skipNext();
    } else {
      setError('Track failed to load and no next track available');
    }
  };

  // Create audio element if it doesn't exist
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      audioRef.current.onplay = () => {
        console.log("Audio play event triggered");
        setIsPlaying(true);
        setError(null); // Clear any previous errors when playback starts
        clearLoadTimeout(); // Clear timeout when playback starts successfully
        retryAttemptsRef.current = 0; // Reset retry counter on successful play
      };
      audioRef.current.onpause = () => {
        console.log("Audio pause event triggered");
        setIsPlaying(false);
      };
      audioRef.current.onwaiting = () => {
        console.log("Audio waiting event triggered");
        setIsLoading(true);
      };
      audioRef.current.oncanplay = () => {
        console.log("Audio can play event triggered");
        setIsLoading(false);
        clearLoadTimeout(); // Clear timeout when track is ready to play
      };
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        console.log("Error code:", audioRef.current?.error?.code);
        console.log("Error message:", audioRef.current?.error?.message);
        setError('Failed to play audio');
        setIsLoading(false);
        
        // If we've tried too many times, skip to the next track
        if (retryAttemptsRef.current >= MAX_RETRY_ATTEMPTS) {
          console.log(`Failed after ${retryAttemptsRef.current} attempts, skipping track`);
          handleAutoSkip();
        } else {
          retryAttemptsRef.current++;
          console.log(`Retry attempt ${retryAttemptsRef.current} of ${MAX_RETRY_ATTEMPTS}`);
          
          // Set timeout for this retry attempt
          clearLoadTimeout();
          loadTimeoutRef.current = setTimeout(handleAutoSkip, ERROR_TIMEOUT_MS);
        }
      };
      audioRef.current.onended = () => {
        console.log("Audio ended event triggered");
        setIsPlaying(false);
        
        // Automatically play the next track if available
        console.log("Can skip next?", {
          skipNextExists: !!skipNext,
          hasNext: radioState?.hasNext
        });
        
        // Check if skipNext exists and hasNext is not explicitly false
        // (handles undefined case which means we just don't know yet)
        if (skipNext && radioState?.hasNext !== false) {
          console.log("Attempting to auto-skip to next track");
          autoPlayAfterSkipRef.current = true; // Mark for auto-play
          skipNext();
        }
      };
    }

    return () => {
      clearLoadTimeout();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update audio source when stream URL changes
  useEffect(() => {
    if (!radioState || !audioRef.current) return;
    
    // Check if this is a new track
    const isNewTrack = currentTrackIdRef.current !== radioState.block.id;
    
    // Update current track ID
    if (isNewTrack) {
      currentTrackIdRef.current = radioState.block.id;
      // Reset retry counter for new tracks
      retryAttemptsRef.current = 0;
    }
    
    // Clear any previous errors when loading a new track
    setError(null);
    
    console.log("radioState updated in useAudioPlayer", { 
      hasNext: radioState.hasNext,
      skipNextFunction: !!skipNext,
      blockType: radioState.block.type,
      blockPosition: radioState.block.position,
      totalBlocks: radioState.totalBlocks,
      isNewTrack
    });

    const isCurrentlyPlaying = !audioRef.current.paused;

    if (!radioState.block?.streamUrl) {
      console.log("No stream URL, stopping audio");
      // audioRef.current.pause(); // TODO: Maybe dont?
      return;
    }

    // If we have a new block or the stream URL has changed
    const newUrl = radioState.block.streamUrl;

    // Handle both relative and absolute URLs, using the backend server
    const fullUrl = newUrl.startsWith('http')
      ? newUrl
      : `http://localhost:5000${newUrl}`;
    console.log(`Constructed full URL: ${fullUrl}`);

    // Compare current src with the new URL
    console.log("Current source vs new source:", {
      currentSrc: audioRef.current.src,
      newFullUrl: fullUrl,
      areEqual: audioRef.current.src === fullUrl
    });

    if (audioRef.current.src !== fullUrl) {
      console.log("URL changed, updating audio source");
      setIsLoading(true);
      
      // Clear any existing timeout
      clearLoadTimeout();
      
      // Set new timeout for loading
      loadTimeoutRef.current = setTimeout(() => {
        console.log("Loading timeout reached");
        handleAutoSkip();
      }, ERROR_TIMEOUT_MS);

      // Update the source using the full URL
      audioRef.current.src = fullUrl;

      // If we were playing before or this is an auto-play after skip, play the new source
      if (isCurrentlyPlaying || autoPlayAfterSkipRef.current) {
        console.log("Auto-playing new track", { 
          wasPlaying: isCurrentlyPlaying, 
          autoPlayAfterSkip: autoPlayAfterSkipRef.current 
        });
        
        autoPlayAfterSkipRef.current = false; // Reset the flag
        
        audioRef.current.play().catch(err => {
          console.error('Failed to play audio:', err);
          setError('Failed to play audio');
          setIsLoading(false);
          
          // If we fail immediately, start the auto-skip process
          if (retryAttemptsRef.current >= MAX_RETRY_ATTEMPTS) {
            handleAutoSkip();
          } else {
            retryAttemptsRef.current++;
          }
        });
      }
    }
  }, [radioState, radioState?.block, radioState?.status, radioState?.block?.streamUrl]);

  // Play/pause controls
  const togglePlay = () => {
    if (!audioRef.current) {
      console.error("Toggle play called but audioRef is null");
      return;
    }

    console.log("Toggle play called, current state:", {
      paused: audioRef.current.paused,
      src: audioRef.current.src,
      readyState: audioRef.current.readyState
    });

    if (audioRef.current.paused) {
      console.log("Attempting to play audio");
      setError(null); // Clear any error before attempting to play
      audioRef.current.play().catch(err => {
        console.error('Failed to play audio:', err);
        setError('Failed to play audio');
      });
    } else {
      console.log("Pausing audio");
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
                audioRef.current.play().catch(err => {
                  console.error('Failed to play audio after retry:', err);
                  
                  // Increment retry counter
                  retryAttemptsRef.current++;
                  
                  // If we've reached max retries, auto-skip
                  if (retryAttemptsRef.current >= MAX_RETRY_ATTEMPTS) {
                    handleAutoSkip();
                  }
                });
              }
            }
          }, 3000);
        } else {
          setError(`Server error: ${response.status}`);
          
          // Auto-skip on serious server errors
          if (response.status >= 500) {
            handleAutoSkip();
          }
        }
      }
    } catch (err) {
      console.error('Stream error check failed:', err);
      retryAttemptsRef.current++;
      
      // If network error persists, auto-skip
      if (retryAttemptsRef.current >= MAX_RETRY_ATTEMPTS) {
        handleAutoSkip();
      }
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
