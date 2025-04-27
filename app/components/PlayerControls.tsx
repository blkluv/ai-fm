import { Button } from "@heroui/react";

export default function PlayerControls() {
  return (
    <div className="flex items-center gap-8">
      <Button
        isIconOnly
        className="bg-white/80 hover:bg-white shadow-md hover:shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Previous"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      
      <Button
        isIconOnly
        className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl rounded-full w-16 h-16 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Play/Pause"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 8H6V16H10V8Z" fill="white"/>
          <path d="M18 8H14V16H18V8Z" fill="white"/>
        </svg>
      </Button>
      
      <Button
        isIconOnly
        className="bg-white/80 hover:bg-white shadow-md hover:shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-105"
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
    </div>
  );
}
