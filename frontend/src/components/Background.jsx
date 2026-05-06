import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + 'vw',
    top: Math.random() * 100 + 'vh',
    animationDuration: Math.random() * 5 + 3 + 's',
    animationDelay: Math.random() * 2 + 's',
    size: Math.random() * 4 + 1 + 'px',
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Cinematic Video Background Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
        src="/bg.mp4"
        onError={(e) => e.target.style.display = 'none'} // Hide if missing
      />
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen scale-110 -z-10"
        style={{
          backgroundImage: "url('/background.png')",
          x: mousePosition.x * -1,
          y: mousePosition.y * -1,
        }}
        animate={{ scale: [1.1, 1.12, 1.1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Red Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-background/80 to-background/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/50 to-background/90" />

      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,46,46,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,46,46,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Animated Scanline */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 animate-scanline shadow-[0_0_10px_#ff2e2e]" />

      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-primary rounded-full animate-float blur-[1px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            boxShadow: '0 0 8px #ff2e2e',
            opacity: Math.random() * 0.5 + 0.2
          }}
        />
      ))}
    </div>
  );
};

export default Background;
