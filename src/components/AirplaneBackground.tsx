import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AirplaneBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  // Smooth spring physics for cursor following
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 25, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Transform mouse position to rotation and position values
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);
  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const translateX = useTransform(smoothX, [0, 1], [-50, 50]);
  const translateY = useTransform(smoothY, [0, 1], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Main 3D Airplane SVG - Centered and cursor-reactive */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] lg:w-[1600px] lg:h-[1600px]"
        style={{ 
          x: translateX,
          y: translateY,
          translateX: '-50%',
          translateY: '-50%',
          perspective: 1000,
        }}
      >
        <motion.svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Aircraft gradients - more visible */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(0 0% 100%)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(0 0% 100%)" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="hsl(0 0% 100%)" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="engineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(0 0% 100%)" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Fuselage - main body */}
          <ellipse 
            cx="200" 
            cy="200" 
            rx="130" 
            ry="22" 
            fill="url(#bodyGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            filter="url(#glow)"
          />

          {/* Cockpit windshield */}
          <path
            d="M330 200 Q360 192 375 200 Q360 208 330 200"
            fill="url(#bodyGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.3"
            strokeWidth="1"
          />

          {/* Main wings - larger and more visible */}
          <path
            d="M150 200 L85 100 Q75 88 65 95 L55 112 Q45 140 85 175 L150 200"
            fill="url(#wingGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
          <path
            d="M150 200 L85 300 Q75 312 65 305 L55 288 Q45 260 85 225 L150 200"
            fill="url(#wingGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            filter="url(#glow)"
          />

          {/* Wing tips - winglets */}
          <path
            d="M65 95 L40 70 Q30 62 28 75 L55 112"
            fill="url(#wingGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <path
            d="M65 305 L40 330 Q30 338 28 325 L55 288"
            fill="url(#wingGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />

          {/* Engines under wings */}
          <ellipse cx="100" cy="140" rx="20" ry="10" fill="url(#engineGradient)" stroke="hsl(0 0% 100%)" strokeOpacity="0.25" strokeWidth="1" />
          <ellipse cx="100" cy="260" rx="20" ry="10" fill="url(#engineGradient)" stroke="hsl(0 0% 100%)" strokeOpacity="0.25" strokeWidth="1" />

          {/* Engine intakes */}
          <ellipse cx="120" cy="140" rx="5" ry="8" fill="hsl(0 0% 100%)" fillOpacity="0.15" />
          <ellipse cx="120" cy="260" rx="5" ry="8" fill="hsl(0 0% 100%)" fillOpacity="0.15" />

          {/* Tail fin - vertical stabilizer */}
          <path
            d="M55 200 L30 135 Q20 115 30 125 L55 170 L55 200"
            fill="url(#wingGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            filter="url(#glow)"
          />

          {/* Horizontal stabilizers */}
          <path
            d="M60 188 L25 160 Q15 155 15 168 L50 188"
            fill="url(#wingGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <path
            d="M60 212 L25 240 Q15 245 15 232 L50 212"
            fill="url(#wingGradient)"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />

          {/* Fuselage window line */}
          <line 
            x1="85" y1="192" 
            x2="325" y2="192" 
            stroke="hsl(0 0% 100%)" 
            strokeOpacity="0.15"
            strokeWidth="2"
            strokeDasharray="12 8"
          />

          {/* Subtle highlight lines on fuselage */}
          <path
            d="M65 188 Q200 180 335 188"
            stroke="hsl(0 0% 100%)"
            strokeOpacity="0.2"
            strokeWidth="1"
            fill="none"
          />

          {/* Nose cone highlight */}
          <ellipse cx="365" cy="200" rx="10" ry="14" fill="hsl(0 0% 100%)" fillOpacity="0.12" />
        </motion.svg>
      </motion.div>

      {/* Ambient glow behind airplane - more visible */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] rounded-full"
        style={{
          x: useTransform(smoothX, [0, 1], [-30, 30]),
          y: useTransform(smoothY, [0, 1], [-20, 20]),
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 40%, transparent 70%)',
        }}
      />

      {/* Floating particles that also respond to cursor */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/25 rounded-full"
          style={{
            left: `${5 + (i * 3.8) % 90}%`,
            top: `${8 + (i * 7.3) % 85}%`,
          }}
          animate={{
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.3, 1],
            x: [0, (mousePosition.x - 0.5) * 20, 0],
            y: [0, (mousePosition.y - 0.5) * 20, 0],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
