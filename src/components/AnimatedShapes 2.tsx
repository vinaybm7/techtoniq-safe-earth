import { useEffect, useRef } from 'react';

const AnimatedShapes = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = 120; // Fixed height for the animation area
      
      // Set display size (CSS pixels)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Set actual size in memory (scaled to account for device pixel ratio)
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      // Scale the context to ensure correct drawing operations
      ctx.scale(scale, scale);
      
      drawShapes();
    };

    // Shape parameters with natural flow from right to left
    const shapes = Array.from({ length: 10 }, (_, i) => {
      const size = 4 + Math.random() * 8; // Smaller and more consistent sizes
      const speed = 0.05 + Math.random() * 0.1; // Slower movement
      const startX = 100 + (Math.random() * 50); // Start off-screen right
      const startY = Math.random() * 70 + 15; // More centered vertically
      const opacity = 0.08 + Math.random() * 0.12; // More subtle
      
      return {
        x: startX,
        y: startY,
        size,
        speed,
        type: Math.floor(Math.random() * 3), // 0: circle, 1: triangle, 2: square
        opacity,
        // Add slight vertical movement
        verticalSpeed: (Math.random() - 0.5) * 0.02,
        verticalRange: 10 + Math.random() * 20,
        baseY: startY
      };
    });

    const drawShapes = () => {
      if (!ctx) return;
      
      const width = canvas?.parentElement?.clientWidth || 0;
      const height = 120;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw each shape
      const now = Date.now();
      shapes.forEach(shape => {
        // Update position - main movement is leftward with slight vertical oscillation
        shape.x -= shape.speed;
        
        // Reset position if off-screen to the left
        if (shape.x < -20) {
          shape.x = 120; // Reset to right side
          shape.y = Math.random() * 70 + 15; // Randomize vertical position
          shape.baseY = shape.y;
        }
        
        // Subtle vertical oscillation
        shape.y = shape.baseY + Math.sin(now * 0.001 * shape.verticalSpeed) * shape.verticalRange;
        
        // Set style
        ctx.globalAlpha = shape.opacity;
        ctx.fillStyle = '#3b82f6'; // techtoniq-blue
        
        // Draw shape
        const x = (shape.x / 100) * width;
        const y = (shape.y / 100) * height;
        const size = shape.size;
        
        ctx.beginPath();
        
        if (shape.type === 0) { // Circle
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        } else if (shape.type === 1) { // Triangle
          ctx.moveTo(x, y - size / 2);
          ctx.lineTo(x + size / 2, y + size / 2);
          ctx.lineTo(x - size / 2, y + size / 2);
          ctx.closePath();
        } else { // Square
          ctx.rect(x - size / 2, y - size / 2, size, size);
        }
        
        ctx.fill();
      });
      
      // Reset global alpha
      ctx.globalAlpha = 1;
      
      // Continue animation
      requestAnimationFrame(drawShapes);
    };
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    const animationId = requestAnimationFrame(drawShapes);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full h-[100px] relative overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0 opacity-20"
      />
    </div>
  );
};

export default AnimatedShapes;
