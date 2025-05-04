// hooks/useAudioPlayer.ts
import {useEffect, useRef, useState} from 'react';
import {RadioState} from '~/types';

export const useAudioPlayer = (
  radioState: RadioState | null, 
  skipNext?: () => void
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayAfterSkipRef = useRef(false);

  // Create audio element if it doesn't exist
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      audioRef.current.onplay = () => {
        console.log("Audio play event triggered");
        setIsPlaying(true);
        setError(null); // Clear any previous errors when playback starts
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
      };
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        console.log("Error code:", audioRef.current?.error?.code);
        console.log("Error message:", audioRef.current?.error?.message);
        setError('Failed to play audio');
        setIsLoading(false);
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update audio source when stream URL changes
  useEffect(() => {
    if (!radioState || !audioRef.current) return;
    
    // Clear any previous errors when loading a new track
    setError(null);
    
    console.log("radioState updated in useAudioPlayer", { 
      hasNext: radioState.hasNext,
      skipNextFunction: !!skipNext,
      blockType: radioState.block.type,
      blockPosition: radioState.block.position,
      totalBlocks: radioState.totalBlocks
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
