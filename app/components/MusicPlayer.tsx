import {Card, CardBody, CardHeader} from "@heroui/react";
import PlayerControls from "./PlayerControls";
import PlayerAvatar from "./PlayerAvatar";
import {useMusicPlayerActions} from "~/hooks/use-music-player-actions.hook";
import {useEffect, useState} from "react";

export default function MusicPlayer(props: { radioId: string }) {
  const {radioId} = props;
  const metadata = {
    title: "Some Radio Title",
    block: "Some Block ID",
  }
  // TODO: WS
  const actions = useMusicPlayerActions(radioId);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function startIt() {
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/stream");
      if (response.ok) {
        const audioStream = new Audio(response.url);
        audioStream.play();
        setAudio(audioStream);
        setIsPlaying(true);
      } else {
        console.error("Failed to start audio stream");
      }
    } catch (error) {
      console.error("Error fetching audio stream:", error);
    }
  }


  function handleNext() {
    console.log("next");
    actions.skipNextMutation.mutate();
  }

  function handlePrevious() {
    console.log("previous");
    actions.skipPreviousMutation.mutate();
  }

  function handleTooglePlay() {
    startIt();
    console.log("toggle play");
    actions.togglePlayMutation.mutate();
  }

  return (
    <Card
      className="max-w-md w-full bg-white text-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-80"></div>

      <CardHeader className="flex justify-center py-6 border-b border-gray-100 relative z-10">
        <h2 className="text-xl font-semibold tracking-wide text-gray-800">
          Radio ID: {radioId} | Title: {metadata.title}
        </h2>
      </CardHeader>

      <CardBody className="flex flex-col items-center gap-12 py-10 relative z-10">
        <PlayerAvatar/>
        <PlayerControls onNext={handleNext} onPrevious={handlePrevious} onTogglePlay={handleTooglePlay}
                        playing={isPlaying}/>
      </CardBody>
    </Card>
  );
}
