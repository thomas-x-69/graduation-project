import React, { useEffect, useState, useRef } from "react";
import { Home, Box, Maximize2, Users, Lightbulb } from "lucide-react";

const LoadingScreen = ({ progress = 0 }) => {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const animationFrameRef = useRef();

  const features = [
    { icon: Home, text: "Intelligent Space Optimization" },
    { icon: Box, text: "Dynamic Room Configuration" },
    { icon: Maximize2, text: "Expandable Living Areas" },
    { icon: Users, text: "Multi-User Adaptation" },
    { icon: Lightbulb, text: "Smart Environment Control" },
  ];

  // Smooth progress animation using requestAnimationFrame
  useEffect(() => {
    const animateProgress = () => {
      setSmoothProgress((prev) => {
        const diff = progress - prev;
        const newProgress = prev + diff * 0.05;

        if (Math.abs(diff) < 0.1) return progress;
        animationFrameRef.current = requestAnimationFrame(animateProgress);
        return newProgress;
      });
    };

    animationFrameRef.current = requestAnimationFrame(animateProgress);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)] animate-pulse"></div>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 bg-blue-500/20 rounded-full animate-firefly"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Animation Container */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Home size={64} className="text-blue-500 animate-float" />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 mb-2 animate-title">
            Rubik's Home
          </h1>
          <p className="text-lg text-gray-400 tracking-wide animate-subtitle">
            SMART LIVING LIVING SPACE
          </p>
        </div>

        {/* Loading Progress */}
        <div className="w-80 mb-8">
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${smoothProgress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span className="animate-pulse">Loading Environment</span>
            <span>{Math.round(smoothProgress)}%</span>
          </div>
        </div>

        {/* Features Showcase - All visible */}
        <div className="flex gap-8 mt-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center opacity-100 transition-all duration-300"
            >
              <feature.icon
                size={24}
                className="text-blue-500 mb-2 hover:scale-110 transition-transform"
              />
              <span className="text-xs text-gray-400 text-center w-24">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
