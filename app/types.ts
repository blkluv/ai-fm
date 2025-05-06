export type RadioState = {
  radioId: string;
  radioTitle: string;
  radioDescription?: string;
  block: {
    id: string;
    type: "song" | "sweeper" | "voiceover"; // TODO: Remove sweeper
    position: number;
    title: string;
    streamUrl: string; // URL to stream the audio for this block
  };
  totalBlocks: number;
  hasNext: boolean;
  hasPrev: boolean;
  status: {
    status: "downloading" | "generating" | "ready";
    progress?: number; // 0-100 percentage if available
  };
  totalSongs: number;
  totalDownloadedSongs: number;
};

export type RadiosResponse = {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  blockCount: number;
  songCount: number;
  createdAt: string;
}[];

export type ModeratorsResponse = {
  id: string;
  name: string;
  personality: string;
}[];