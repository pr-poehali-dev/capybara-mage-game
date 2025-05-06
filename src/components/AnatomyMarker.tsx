
import React from "react";
import { cn } from "@/lib/utils";

interface AnatomyMarkerProps {
  x: number;
  y: number;
  label: string;
  className?: string;
}

const AnatomyMarker = ({ x, y, label, className }: AnatomyMarkerProps) => {
  return (
    <div 
      className={cn("absolute", className)}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`
      }}
    >
      <div className="w-4 h-4 bg-cyan-500 rounded-full">
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-white px-2 py-1 rounded text-xs font-bold shadow-md whitespace-nowrap">
          {label}
        </div>
        <div className="absolute w-0.5 h-10 bg-cyan-500 left-1/2 transform -translate-x-1/2 -bottom-10"></div>
      </div>
    </div>
  );
};

export default AnatomyMarker;
