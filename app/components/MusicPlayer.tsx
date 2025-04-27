import { Card, CardBody, CardHeader } from "@heroui/react";
import PlayerControls from "./PlayerControls";
import PlayerAvatar from "./PlayerAvatar";

export default function MusicPlayer() {
  return (
    <Card className="max-w-md w-full bg-white text-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-80"></div>
      
      <CardHeader className="flex justify-center py-6 border-b border-gray-100 relative z-10">
        <h2 className="text-xl font-semibold tracking-wide text-gray-800">
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
