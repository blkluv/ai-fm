// components/RadioPlayer.tsx
import React from 'react';
import {useRadioWebSocket} from '~/hooks/useRadioWebSocket';
import {useAudioPlayer} from '~/hooks/useAudioPlayer';
import {Button, Card, CardBody, CardHeader, Divider, Progress, Spinner} from "@heroui/react";

interface RadioPlayerProps {
  radioId: string;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({
                                                          radioId
                                                        }) => {
  const {
    radioState,
    isConnected,
    error: wsError,
    skipNext,
    skipPrevious
  } = useRadioWebSocket(radioId);

  const {
    isPlaying,
    isLoading,
    error: audioError,
    togglePlay
  } = useAudioPlayer(radioState);

  // Show loading state when block is being prepared
  const isBlockLoading = radioState?.playState === 'loading'
    ||
    radioState?.loadingProgress?.status === 'downloading' ||
    radioState?.loadingProgress?.status === 'generating';

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      {/* Connection status */}
      {!isConnected && (
        <CardBody className="flex items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner color="primary" label="Connecting to radio..."/>
            {wsError && (
              <div className="text-red-500 mt-2">{wsError}</div>
            )}
          </div>
        </CardBody>
      )}

      {/* Radio info */}
      {radioState && (
        <>
          <CardHeader className="flex flex-col items-start pb-0">
            <h1 className="text-2xl font-bold">{radioState.radioTitle}</h1>
            {radioState.radioDescription && (
              <p className="text-gray-500 text-sm">{radioState.radioDescription}</p>
            )}
          </CardHeader>

          <CardBody className="flex flex-col gap-4">
            {/* Current block info */}
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-primary-500">
                {radioState.block.type.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold">{radioState.block.title}</h2>
              <div className="text-xs text-gray-500">
                Block {radioState.block.position + 1} of {radioState.totalBlocks}
              </div>
            </div>

            <Divider className="my-2"/>

            {/* Loading indicator */}
            {isBlockLoading && (
              <div className="flex flex-col gap-2 my-2">
                <div className="flex items-center gap-2">
                  <Spinner size="sm"/>
                  <span className="text-sm">
                    {radioState.loadingProgress?.status === 'downloading'
                      ? 'Downloading audio...'
                      : radioState.loadingProgress?.status === 'generating'
                        ? 'Generating voiceover...'
                        : 'Preparing audio...'}
                  </span>
                </div>

                {radioState.loadingProgress?.progress !== undefined && (
                  <Progress
                    value={radioState.loadingProgress.progress}
                    color="primary"
                    size="sm"
                    className="mt-1"
                  />
                )}
              </div>
            )}

            {/* Player controls */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <Button
                onClick={skipPrevious}
                isDisabled={!radioState.hasPrev || isBlockLoading}
                variant="flat"
                color="primary"
                className="flex-1"
                startContent={<span>⏮</span>}
              >
                Prev
              </Button>

              <Button
                onClick={togglePlay}
                isDisabled={isBlockLoading}
                color="primary"
                variant="solid"
                className="flex-1"
                startContent={isPlaying ? <span>⏸</span> : <span>▶️</span>}
              >
                {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
              </Button>

              <Button
                onClick={skipNext}
                isDisabled={!radioState.hasNext || isBlockLoading}
                variant="flat"
                color="primary"
                className="flex-1"
                endContent={<span>⏭</span>}
              >
                Next
              </Button>
            </div>

            {/* Error messages */}
            {(wsError || audioError) && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {wsError || audioError}
              </div>
            )}
          </CardBody>
        </>
      )}
    </Card>
  );
};
