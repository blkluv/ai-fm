// components/RadioPlayer.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {useRadioWebSocket} from '~/hooks/useRadioWebSocket';
import {useAudioPlayer} from '~/hooks/useAudioPlayer';
import {Button, Card, CardBody, Chip, Divider, Progress, Spinner} from "@heroui/react";
import {FaBackwardStep, FaForwardStep, FaPause, FaPlay} from "react-icons/fa6";

interface RadioPlayerProps {
  radioId: string;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({radioId}) => {
  const {
    radioState,
    isConnected,
    error: wsError,
    skipNext,
    skipPrevious
  } = useRadioWebSocket(radioId);

  const [animateTrack, setAnimateTrack] = useState(false);

  // Define a wrapped skipNext function with logging
  const handleSkipNext = useCallback(() => {
    console.log("Skip next triggered from RadioPlayer");
    skipNext();
  }, [skipNext]);

  const {
    isPlaying,
    isLoading,
    error: audioError,
    togglePlay
  } = useAudioPlayer(radioState, handleSkipNext);

  // Show loading state when block is being prepared
  const isBlockLoading = radioState?.status.status === "downloading" || radioState?.status.status === "generating";

  const nowPlaying = radioState?.block?.type === "song" ? "Track" : radioState?.block?.type === "sweeper" ? "Sweeper" : "Voiceover";

  // Trigger animation when track changes
  useEffect(() => {
    if (radioState?.block?.id) {
      setAnimateTrack(true);
      const timer = setTimeout(() => setAnimateTrack(false), 500);
      return () => clearTimeout(timer);
    }
  }, [radioState?.block?.id]);

  // Loading animation
  if (!isConnected) {
    return (
      <div
        className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-200 to-primary-400 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📻</span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Connecting to Radio</h3>
            <p className="text-gray-500">Tuning into your station...</p>
          </div>
          {wsError && (
            <div className="text-red-500 mt-2 text-center max-w-xs">{wsError}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card
      className="w-full max-w-md mx-auto overflow-hidden backdrop-blur-md bg-white/90 border-none shadow-2xl rounded-3xl">
      {/* Radio Header */}
      {radioState && (
        <div className="relative">
          {/* Album Art Placeholder */}
          <div
            className="w-full h-28 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-300 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Audio Wave Animation */}
                {isPlaying && (
                  <div className="flex items-center justify-center w-full h-full gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white/30 rounded-full w-1.5 h-8 animate-sound-wave"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          height: `${Math.max(20, Math.floor(Math.random() * 40))}px`
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Station Logo */}
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center mr-3">
                      <span className="text-xl">📻</span>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-white drop-shadow-md">
                        {radioState.radioTitle}
                      </h1>
                      {radioState.radioDescription && (
                        <p className="text-xs text-white/80">{radioState.radioDescription}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status Chip */}
          <div className="absolute top-3 right-3">
            <Chip
              size="sm"
              variant="flat"
              color={isPlaying ? "success" : "default"}
              className="backdrop-blur-md bg-white/30"
            >
              {isPlaying ? "ON AIR" : "PAUSED"}
            </Chip>
          </div>
        </div>
      )}

      {radioState && (
        <CardBody className="flex flex-col gap-5 p-6">
          {/* Current Track Display */}
          <div
            className={`flex flex-col gap-1 transition-all duration-300 ${
              animateTrack ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-medium text-primary-500 uppercase tracking-wider mb-1 line-clamp-1">
                  Now Playing • {nowPlaying}
                </div>
                <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{radioState.block.title}</h2>
              </div>

              <div
                className="flex items-center justify-center min-w-[50px] h-[24px] rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                {radioState.block.position + 1}/{radioState.totalBlocks}
              </div>
            </div>
          </div>

          {/* Track Progress / Loading */}
          {isBlockLoading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="primary"/>
                  <span className="text-gray-600">
                    {radioState.status?.status === 'downloading'
                      ? 'Downloading track...'
                      : radioState.status?.status === 'generating'
                        ? 'Generating voiceover...'
                        : 'Preparing audio...'}
                  </span>
                </div>
                {radioState.status?.progress !== undefined && (
                  <span className="text-xs font-medium text-gray-500">
                    {Math.round(radioState.status.progress)}%
                  </span>
                )}
              </div>

              {radioState.status?.progress !== undefined && (
                <Progress
                  value={radioState.status.progress}
                  color="primary"
                  size="sm"
                  className="h-1"
                  isIndeterminate={radioState.status.progress === 0}
                />
              )}
            </div>
          ) : (
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              {isPlaying && (
                <div
                  className="h-full bg-primary-500 rounded-full animate-pulse"
                  style={{width: '100%', animationDuration: '2s'}}
                ></div>
              )}
            </div>
          )}

          <Divider className="my-1"/>

          {/* Player Controls */}
          <div className="flex items-center justify-between gap-4">
            <Button
              isIconOnly
              onPress={skipPrevious}
              isDisabled={!radioState.hasPrev || isBlockLoading}
              variant="light"
              radius="full"
              size="lg"
              className="bg-gray-100/70 hover:bg-gray-200/70 text-gray-700"
            >
              <FaBackwardStep className="text-xl"/>
            </Button>

            <Button
              onPress={togglePlay}
              isDisabled={isBlockLoading}
              color="primary"
              size="lg"
              radius="full"
              className="min-w-[100px] h-[56px]"
              isLoading={isLoading}
            >
              {!isLoading && (
                isPlaying ?
                  <FaPause className="text-2xl"/> :
                  <FaPlay className="text-2xl ml-1"/>
              )}
            </Button>

            <Button
              isIconOnly
              onPress={() => {
                console.log("Next button clicked manually");
                skipNext();
              }}
              isDisabled={!radioState.hasNext || isBlockLoading}
              variant="light"
              radius="full"
              size="lg"
              className="bg-gray-100/70 hover:bg-gray-200/70 text-gray-700"
            >
              <FaForwardStep className="text-xl"/>
            </Button>
          </div>

          {/* Error messages */}
          {(wsError || audioError) && (
            <div className="text-red-500 text-sm mt-2 text-center px-4 py-2 bg-red-50 rounded-lg">
              {wsError || audioError}
            </div>
          )}
        </CardBody>
      )}
    </Card>
  );
};