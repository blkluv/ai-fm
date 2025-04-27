import {useParams} from "@remix-run/react";
import MusicPlayer from "~/components/MusicPlayer";
import {useEffect} from "react";

export default function Radio() {
  const {radio_id: radioId} = useParams();

  useEffect(() => {
    console.log(radioId);
  }, [radioId]);

  return (<div className="flex h-screen items-center justify-center bg-slate-100">
    {/* Matte texture overlay */}
    <div
      className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2YxZjVmOSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjZTJlOGYwIj48L2NpcmNsZT4KPC9zdmc+')] opacity-80"></div>

    {/* Subtle color accents */}
    <div
      className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>
    <div
      className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-3xl"></div>

    <MusicPlayer/>
  </div>)
}