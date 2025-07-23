// import React from "react";

// const SplashScreen = () => (
//   <div
//     style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100vw",
//       height: "100vh",
//       background: "#787878",
//       color: "#fff",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 9999,
//       fontSize: "2rem",
//       flexDirection: "column"
//     }}
//   >
//     <img src="/192IMAGE.png" alt="Logo" style={{ width: 96, height: 96, marginBottom: 24 }} />
//     <span>Shop Management App</span>
//   </div>
// );

// export default SplashScreen; 




"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface SplashScreenProps {
  onComplete?: () => void
  duration?: number
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    // Animation phases
    const timer1 = setTimeout(() => setAnimationPhase(1), 100)
    const timer2 = setTimeout(() => setAnimationPhase(2), 800)
    const timer3 = setTimeout(() => setAnimationPhase(3), 1500)

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete?.(), 500)
    }, duration)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(hideTimer)
    }
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`
      fixed inset-0 z-[9999] 
      bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800
      flex flex-col items-center justify-center
      transition-opacity duration-500
      ${!isVisible ? "opacity-0" : "opacity-100"}
    `}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/3 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container */}
        <div
          className={`
          mb-8 transition-all duration-1000 ease-out
          ${animationPhase >= 1 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-8"}
        `}
        >
          <div className="relative">
            <img src="/192IMAGE.png" alt="Shop Management App Logo" className="w-24 h-24 rounded-2xl shadow-2xl" />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-pulse" />
          </div>
        </div>

        {/* App title */}
        <div
          className={`
          mb-8 transition-all duration-1000 ease-out delay-300
          ${animationPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide">Shop Management</h1>
          <p className="text-lg text-slate-300 text-center mt-2 font-light">Your Business, Simplified</p>
        </div>

        {/* Loading indicator */}
        <div
          className={`
          transition-all duration-1000 ease-out delay-700
          ${animationPhase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
        >
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <div className="w-48 h-1 bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"
                style={{
                  animation: "loading 2s ease-in-out infinite",
                }}
              />
            </div>
            <p className="text-sm text-slate-400 animate-pulse">Loading your workspace...</p>
          </div>
        </div>
      </div>

      {/* Custom CSS for loading animation */}
      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}

export default SplashScreen
