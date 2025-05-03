export interface RadioState {
  radioId: string;
  radioTitle: string;
  radioDescription?: string;
  block: {
    id: string;
    type: "song" | "sweeper" | "voiceover";
    position: number;
    title: string;
    streamUrl: string;
  };
  totalBlocks: number;
  hasNext: boolean;
  hasPrev: boolean;
  playState: "loading" | "playing" | "paused" | "stopped";
  loadingProgress?: {
    status: "downloading" | "generating" | "ready";
    progress?: number;
  };
}