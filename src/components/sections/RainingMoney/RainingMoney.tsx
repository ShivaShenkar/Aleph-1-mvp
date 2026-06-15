"use client";

import { useEffect, useRef } from "react";
import styles from "./RainingMoney.module.scss";
export default function RainingMoneyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    //initialize canvas and context
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to fit its wrapper section perfectly
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create the particle setup
    const particleCount = 60;
    const items: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      spinSpeed: number;
      type: "coin" | "bill";
    }> = [];

    //making particles with random properties for a natural effect
    for (let i = 0; i < particleCount; i++) {
      items.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 8, // Dimensions
        speed: Math.random() * 2 + 1.5, // Falling speed
        angle: Math.random() * Math.PI * 2,
        spinSpeed: Math.random() * 0.05 - 0.025,
        type: "bill",
      });
    }

    // Animation loop using requestAnimationFrame
    let animationFrameId: number;

    //animation function to update and draw each frame3
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      items.forEach((item) => {
        item.y += item.speed;
        item.angle += item.spinSpeed;
        // Subtle wind/sway effect
        item.x += Math.sin(item.angle) * 0.5; 

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.angle);

        if (item.type === "coin") {
          // Draw a 2D Gold Coin
          ctx.beginPath();
          ctx.ellipse(0, 0, item.size, item.size * Math.cos(item.angle), 0, 0, Math.PI * 2);
          ctx.fillStyle = "#FBBF24"; // Tailwind Amber-400
          ctx.fill();
          ctx.strokeStyle = "#D97706"; // Amber-600 border
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Draw a 2D Dollar Bill
          ctx.fillStyle = "#4ADE80"; // Tailwind Green-400
          ctx.fillRect(-item.size, -item.size / 2, item.size * 2, item.size);
          ctx.strokeStyle = "#15803D"; // Green-700 details
          ctx.lineWidth = 1;
          ctx.strokeRect(-item.size, -item.size / 2, item.size * 2, item.size);
          ctx.beginPath();
          ctx.arc(0, 0, item.size / 4, 0, Math.PI * 2);
          ctx.fillStyle = "#15803D";
          ctx.fill();   
        }

        ctx.restore();

        // If an item reaches the bottom, recycle it smoothly back to the top
        if (item.y > canvas.height + item.size) {
          item.y = -20;
          item.x = Math.random() * canvas.width;
          item.speed = Math.random() * 2 + 1.5;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up to prevent event listener and animation frame leaks!
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.moneyCanvas}/>
  );
}