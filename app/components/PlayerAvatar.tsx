import { Card } from "@heroui/react";

export default function PlayerAvatar() {
  return (
    <Card className="w-64 h-48 bg-gradient-to-br from-blue-500 to-teal-400 rounded-3xl flex items-center justify-center shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]"></div>
      
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
          <p className="text-white font-medium tracking-widest">avatar</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-4 h-4 rounded-full bg-white/50"></div>
        <div className="absolute bottom-8 right-10 w-3 h-3 rounded-full bg-white/40"></div>
        <div className="absolute top-1/3 right-8 w-5 h-5 rounded-full bg-white/30"></div>
      </div>
    </Card>
  );
}
