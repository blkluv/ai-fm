import { Card, CardBody, CardHeader } from "@heroui/react";
import PlayerControls from "./PlayerControls";
import PlayerAvatar from "./PlayerAvatar";

export default function MusicPlayer() {
  return (
    <Card className="max-w-md w-full bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(176,130,255,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_70%)]"></div>
      
      <CardHeader className="flex justify-center py-6 border-b border-indigo-100 relative z-10">
        <h2 className="text-xl font-semibold tracking-wide text-indigo-900">
          Radio: #6 | block #2 (title)
        </h2>
      </CardHeader>
      
      <CardBody className="flex flex-col items-center gap-12 py-10 relative z-10">
        <PlayerAvatar />
        <PlayerControls />
      </CardBody>
    </Card>
  );
}
