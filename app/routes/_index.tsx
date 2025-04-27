import type { MetaFunction } from "@remix-run/node";
import MusicPlayer from "~/components/MusicPlayer";

export const meta: MetaFunction = () => {
  return [
    { title: "Music Player" },
    { name: "description", content: "A beautiful music player UI" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.1),transparent_70%)]"></div>
      <MusicPlayer />
    </div>
  );
}
