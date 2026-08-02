import React, { useRef, useEffect, useState } from 'react';
import './SpinWheel.css';

const SECTOR_COLORS = [
  '#ff8c00', '#ffd700', '#ff6347', '#87ceeb',
  '#da70d6', '#32cd32', '#ff69b4', '#1e90ff',
];

const SpinWheel = ({ data, mustSpin, prizeIndex, onStopSpinning }) => {
  const canvasRef = useRef(null);
  const rotationAngle = useRef(0);
  const animationFrame = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectorAngle = (2 * Math.PI) / data.length;

  // Draw the wheel – only gift emoji, no real images or names
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = Math.min(cx, cy) - 15;

    ctx.clearRect(0, 0, cw, ch);

    // Draw coloured sectors
    for (let i = 0; i < data.length; i++) {
      const start = i * sectorAngle;
      const end = start + sectorAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = SECTOR_COLORS[i % SECTOR_COLORS.length];
      ctx.fill();
      ctx.stroke();

      // Draw gift emoji in the middle of the sector
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + sectorAngle / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '32px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText('🎁', radius * 0.65, 0);   // place emoji at ~65% of radius
      ctx.restore();
    }

    // Draw the rotating hand (pointer)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationAngle.current);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(radius - 5, 0);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Centre circle
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  // Initial draw when data changes
  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [data, imagesLoaded]);

  // Set imagesLoaded to true (we don’t need to preload images anymore)
  useEffect(() => {
    setImagesLoaded(true);
  }, []);

  // Spin animation
  useEffect(() => {
    if (!mustSpin || isAnimating || data.length === 0 || prizeIndex === null) return;

    setIsAnimating(true);

    const targetSectorMid = prizeIndex * sectorAngle + sectorAngle / 2;
    const randomOffset = (Math.random() - 0.5) * sectorAngle * 0.7;
    const totalTarget = targetSectorMid + randomOffset;
    const fullSpins = 5 * 2 * Math.PI;
    const startAngle = rotationAngle.current;
    const targetAngle = startAngle + fullSpins + totalTarget;

    const duration = 4000;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      rotationAngle.current = startAngle + (targetAngle - startAngle) * eased;
      draw();

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        if (onStopSpinning) onStopSpinning();
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
    // eslint-disable-next-line
  }, [mustSpin, prizeIndex, data]);

  return (
    <div className="wheel-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default SpinWheel;