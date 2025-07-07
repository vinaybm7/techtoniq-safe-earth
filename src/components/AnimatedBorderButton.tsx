import React, { useEffect, useRef } from 'react';
import { Button, ButtonProps } from "@/components/ui/button";

interface AnimatedBorderButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedBorderButton = React.forwardRef<HTMLButtonElement, AnimatedBorderButtonProps>(
  ({ children, className = '', variant = 'default', ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    let progress = 0;
    let gradientRotation = 0;

    useEffect(() => {
      const button = buttonRef.current;
      const canvas = canvasRef.current;
      if (!button || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match button
      const updateCanvasSize = () => {
        const rect = button.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      };

      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);

      const drawBorder = () => {
        if (!ctx) return;
        
        const width = canvas.width;
        const height = canvas.height;
        const borderWidth = 2;
        const borderRadius = 8; // Match your button's border radius
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Create gradient
        gradientRotation = (gradientRotation + 0.5) % 360;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#10b981'); // emerald-500
        gradient.addColorStop(0.5, '#22c55e'); // green-500
        gradient.addColorStop(1, '#10b981'); // emerald-500
        
        // Draw border
        ctx.strokeStyle = gradient;
        ctx.lineWidth = borderWidth;
        ctx.beginPath();
        
        // Draw rounded rectangle border
        ctx.roundRect(
          borderWidth / 2, 
          borderWidth / 2, 
          width - borderWidth, 
          height - borderWidth, 
          [borderRadius]
        );
        
        // Animate the dash pattern
        const length = 2 * (width + height);
        const dashLength = 20;
        const gapLength = 10;
        const dashArray = [dashLength, gapLength];
        const dashOffset = progress % (dashLength + gapLength);
        
        ctx.setLineDash(dashArray);
        ctx.lineDashOffset = -dashOffset;
        ctx.stroke();
        
        progress += 0.5;
        animationRef.current = requestAnimationFrame(drawBorder);
      };

      animationRef.current = requestAnimationFrame(drawBorder);

      return () => {
        window.removeEventListener('resize', updateCanvasSize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    return (
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />
        <Button
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }}
          className={`relative z-10 bg-techtoniq-blue hover:bg-techtoniq-blue/90 transition-colors duration-300 ${className}`}
          variant={variant}
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  }
);

AnimatedBorderButton.displayName = 'AnimatedBorderButton';

export default AnimatedBorderButton;
