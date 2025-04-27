import { Card } from "@heroui/react";

export default function PlayerAvatar() {
  return (
    <Card className="w-64 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0,rgba(255,255,255,0)_70%)]"></div>
      
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <p className="text-white font-medium tracking-widest">avatar</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-white/40"></div>
        <div className="absolute bottom-6 right-8 w-2 h-2 rounded-full bg-white/30"></div>
        <div className="absolute top-1/2 right-6 w-4 h-4 rounded-full bg-white/20"></div>
      </div>
    </Card>
  );
}
