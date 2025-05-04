import {useNavigate, useParams} from "@remix-run/react";
import { FaArrowLeft } from "react-icons/fa6";
import {useEffect} from "react";
import {RadioPlayer} from "~/components/RadioPlayer";

export default function Radio() {
  const {radio_id: radioId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("radioId:", radioId);
  }, [radioId]);

  if (!radioId) {
    return <div>Radio ID not found</div>
  }

  return (<div className="flex flex-col h-screen bg-slate-100">
    {/* Back button */}
    <div className="absolute top-4 left-4 z-10">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm hover:shadow transition-all"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back to Dashboard</span>
      </button>
    </div>
    
    {/* Matte texture overlay */}
    <div
      className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2YxZjVmOSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjZTJlOGYwIj48L2NpcmNsZT4KPC9zdmc+')] opacity-80"></div>

    {/* Enhanced color accents */}
    <div
      className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-300/20 via-purple-300/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
    <div
      className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary-300/20 via-secondary-300/10 to-transparent rounded-full blur-3xl animate-float"></div>
    <div 
      className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-tr from-yellow-300/20 to-orange-300/20 rounded-full blur-2xl animate-pulse-slow"
      style={{ animationDelay: "1s" }}></div>

    {/* Sound wave animation deco elements */}
    <div className="absolute bottom-0 inset-x-0 h-16 flex items-end justify-center opacity-20 pointer-events-none">
      <div className="flex items-end gap-1">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="bg-primary-400 rounded-t w-1.5 animate-sound-wave" 
            style={{ 
              height: `${Math.max(5, Math.floor(Math.sin(i * 0.5) * 25) + 20)}px`,
              animationDelay: `${i * 0.05}s`,
              opacity: Math.max(0.2, Math.sin(i * 0.2))
            }}
          ></div>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-center flex-1 p-4">
      <RadioPlayer radioId={radioId}/>
    </div>
  </div>)
}
