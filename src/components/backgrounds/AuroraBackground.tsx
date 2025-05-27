import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const AuroraBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const drawAurora = () => {
      ctx.fillStyle = isDarkMode ? '#0d0d0d' : '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (isDarkMode) {
        gradient.addColorStop(0, 'rgba(0, 224, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 183, 0.1)');
        gradient.addColorStop(1, 'rgba(163, 112, 247, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)');
      }
      
      ctx.fillStyle = gradient;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.5);
        
        for (let x = 0; x < canvas.width; x += 20) {
          const y = canvas.height * 0.5 + 
                    Math.sin(x * 0.01 + time + i) * 50 + 
                    Math.sin(x * 0.02 + time * 0.5) * 30;
          
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      
      time += 0.005;
      animationFrameId = requestAnimationFrame(drawAurora);
    };
    
    window.addEventListener('resize', resize);
    resize();
    drawAurora();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};