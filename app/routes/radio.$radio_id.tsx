import {useNavigate, useParams} from "@remix-run/react";
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
        <span>←</span>
        <span>Back to Dashboard</span>
      </button>
    </div>
    
    {/* Matte texture overlay */}
    <div
      className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2YxZjVmOSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjZTJlOGYwIj48L2NpcmNsZT4KPC9zdmc+')] opacity-80"></div>

    {/* Subtle color accents */}
    <div
      className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>
    <div
      className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-3xl"></div>

    <div className="flex items-center justify-center flex-1">
      <RadioPlayer radioId={radioId}/>
    </div>
  </div>)
}
