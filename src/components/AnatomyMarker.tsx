
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnatomyMarkerProps {
  x: number;
  y: number;
  label: string;
  className?: string;
  draggable?: boolean;
  onDrag?: (newX: number, newY: number) => void;
  onClick?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  isActive?: boolean;
}

const AnatomyMarker = ({ 
  x, 
  y, 
  label, 
  className,
  draggable = false,
  onDrag,
  onClick,
  containerRef,
  isActive
}: AnatomyMarkerProps) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);
  
  useEffect(() => {
    if (!draggable) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef?.current || !markerRef.current) return;
      
      const container = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(e.clientX - container.left, container.width));
      const newY = Math.max(0, Math.min(e.clientY - container.top, container.height));
      
      setPosition({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      if (isDragging && onDrag) {
        onDrag(position.x, position.y);
      }
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, onDrag, containerRef, draggable]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggable) {
      e.preventDefault();
      setIsDragging(true);
    }
  };
  
  const handleClick = () => {
    if (onClick && !isDragging) {
      onClick();
    }
  };

  return (
    <div 
      ref={markerRef}
      className={cn(
        "absolute cursor-pointer transition-all duration-200",
        draggable && "cursor-move",
        className
      )}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        zIndex: isDragging ? 100 : 10
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className={cn(
        "w-4 h-4 rounded-full relative transition-all",
        isDragging ? "scale-150" : "",
        isActive ? "bg-emerald-500 animate-pulse" : "bg-cyan-500 animate-pulse"
      )}>
        <div className={cn(
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap transition-all", 
          isDragging ? "scale-110" : "",
          className
        )}>
          {label}
          {isActive && " ✓"}
        </div>
        <div className={cn(
          "absolute w-0.5 h-10 left-1/2 transform -translate-x-1/2 -bottom-10",
          isActive ? "bg-emerald-500" : "bg-cyan-500"
        )}></div>
      </div>
    </div>
  );
};

export default AnatomyMarker;
