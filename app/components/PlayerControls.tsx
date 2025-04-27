import {Button} from "@heroui/react";

export default function PlayerControls(props: {
  playing: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onTogglePlay: () => void;
}) {
  return (
    <div className="flex items-center gap-8">
      <Button
        onPress={props.onPrevious}
        isIconOnly
        className="bg-gray-100 hover:bg-gray-200 shadow-sm hover:shadow rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Previous"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>

      <Button
        onPress={props.onTogglePlay}
        isIconOnly
        className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white shadow-md hover:shadow-lg rounded-full w-16 h-16 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Play/Pause"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 8H6V16H10V8Z" fill="white"/>
          <path d="M18 8H14V16H18V8Z" fill="white"/>
        </svg>
      </Button>

      <Button
        onPress={props.onNext}
        isIconOnly
        className="bg-gray-100 hover:bg-gray-200 shadow-sm hover:shadow rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
    </div>
  );
}
