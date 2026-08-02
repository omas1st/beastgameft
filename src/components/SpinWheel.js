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
  const imagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectorAngle = (2 * Math.PI) / data.length;

  // Draw the wheel + hand
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

    // sectors
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

      // name
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + sectorAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(data[i].option, radius - 15, 5);
      ctx.restore();

      // image
      const img = imagesRef.current[data[i].image];
      if (img) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + sectorAngle / 2);
        const imgSize = Math.min(sectorAngle * radius * 0.4, 35);
        ctx.drawImage(img, radius * 0.4, -imgSize / 2, imgSize, imgSize);
        ctx.restore();
      }
    }

    // rotating hand
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
    // centre circle
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // Preload images
  useEffect(() => {
    const load = async () => {
      const promises = data.map((item) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            imagesRef.current[item.image] = img;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = item.image;
        });
      });
      await Promise.all(promises);
      setImagesLoaded(true);
    };
    load();
  }, [data]);

  // Draw whenever images loaded or data changes
  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [imagesLoaded, data]);

  // Spin animation effect
  useEffect(() => {
    if (!mustSpin || isAnimating || data.length === 0 || prizeIndex === null) return;

    setIsAnimating(true);

    // Calculate final angle so that the hand points to the winning sector
    const targetSectorMid = prizeIndex * sectorAngle + sectorAngle / 2;
    const randomOffset = (Math.random() - 0.5) * sectorAngle * 0.7;
    const totalTarget = targetSectorMid + randomOffset;
    const fullSpins = 5 * 2 * Math.PI;
    const startAngle = rotationAngle.current;
    const targetAngle = startAngle + fullSpins + totalTarget;

    const duration = 4000; // ms
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out
      rotationAngle.current = startAngle + (targetAngle - startAngle) * eased;
      draw();

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        // spin finished
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