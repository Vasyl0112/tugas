import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const stars: { x: number; y: number; radius: number; speed: number; opacity: number }[] = [];
    let animationFrameId: number;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };
    
    const initStars = () => {
      stars.length = 0;
      const numberOfStars = Math.floor((canvas.width * canvas.height) / 3000);
      
      for (let i = 0; i < numberOfStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          speed: 0.1 + Math.random() * 0.3,
          opacity: 0.1 + Math.random() * 0.9
        });
      }
    };
    
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${isDarkMode ? star.opacity : star.opacity * 0.4})`;
        ctx.fill();
        
        star.y += star.speed;
        
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId = requestAnimationFrame(drawStars);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawStars();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};