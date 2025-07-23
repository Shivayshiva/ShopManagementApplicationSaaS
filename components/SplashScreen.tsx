"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content after a brief delay
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 1000)

    // Simulate loading completion
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 8000)

    return () => {
      clearTimeout(contentTimer)
      clearTimeout(loadingTimer)
    }
  }, [])

  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center p-4 max-w-sm mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">Welcome!</h1>
          <p className="text-sm sm:text-base text-gray-300">Loading complete. Ready to proceed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>
      </div>

      {/* Animated Particles - Reduced for mobile performance */}
      <div className="absolute inset-0">
        <div className="particles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
          {/* Additional particles for larger screens */}
          <div className="hidden sm:block">
            {[...Array(10)].map((_, i) => (
              <div key={i + 10} className={`particle particle-${i + 11}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center w-full max-w-sm sm:max-w-md md:max-w-lg transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Jai Maa Sirsa Text - Mobile First */}
        <div className="jai-maa-text mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-300 px-2">
            <span className="text-shadow-gold">|| जय माँ सिरसा ||</span>
          </h2>
        </div>

        {/* Animated Logo - Responsive Sizing */}
        <div className="logo-container mb-6 sm:mb-8 flex justify-center items-center">
          <div className="logo-wrapper">
            <svg
              width="80"
              height="80"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="logo-svg mx-auto sm:w-24 sm:h-24 md:w-32 md:h-32"
            >
              <rect x="10" y="10" width="180" height="180" stroke="white" strokeWidth="8" fill="none" />
              <rect x="30" y="30" width="140" height="140" stroke="white" strokeWidth="8" fill="none" />
              <rect x="50" y="50" width="100" height="100" stroke="white" strokeWidth="8" fill="none" />
              <rect x="70" y="70" width="60" height="60" stroke="white" strokeWidth="8" fill="none" />
              <rect x="90" y="90" width="20" height="20" stroke="white" strokeWidth="8" fill="none" />
            </svg>
          </div>
        </div>

        {/* Shop Name - Mobile First Typography */}
        <h1 className="shop-name text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-wide px-2">
          <span className="text-shadow">Vaishno Vashtra Vibhag</span>
        </h1>

        {/* Hindi Tagline - Mobile Optimized */}
        <p className="tagline text-base sm:text-lg md:text-xl lg:text-2xl text-orange-100 mb-6 sm:mb-8 font-medium px-2">
          <span className="text-shadow">आपका भरोसा, हमारा विश्वास</span>
        </p>

        {/* Animated Loader - Mobile Optimized */}
        <div className="loader-container">
          <div className="loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
          <p className="text-white mt-3 sm:mt-4 text-xs sm:text-sm opacity-80">Loading...</p>
        </div>
      </div>

      <style jsx>{`
        /* Mobile-first responsive design */
        .floating-shapes {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        /* Mobile sizes */
        .shape-1 {
          width: 40px;
          height: 40px;
          top: 15%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 30px;
          height: 30px;
          top: 70%;
          right: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 50px;
          height: 50px;
          bottom: 25%;
          left: 15%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 25px;
          height: 25px;
          top: 40%;
          right: 25%;
          animation-delay: 1s;
        }

        .shape-5 {
          width: 35px;
          height: 35px;
          bottom: 50%;
          right: 5%;
          animation-delay: 3s;
        }

        /* Tablet and desktop sizes */
        @media (min-width: 640px) {
          .shape-1 {
            width: 60px;
            height: 60px;
            top: 20%;
            left: 8%;
          }

          .shape-2 {
            width: 45px;
            height: 45px;
            top: 65%;
            right: 12%;
          }

          .shape-3 {
            width: 75px;
            height: 75px;
            bottom: 20%;
            left: 18%;
          }

          .shape-4 {
            width: 35px;
            height: 35px;
            top: 35%;
            right: 28%;
          }

          .shape-5 {
            width: 55px;
            height: 55px;
            bottom: 45%;
            right: 8%;
          }
        }

        @media (min-width: 768px) {
          .shape-1 {
            width: 80px;
            height: 80px;
            top: 20%;
            left: 10%;
          }

          .shape-2 {
            width: 60px;
            height: 60px;
            top: 60%;
            right: 15%;
          }

          .shape-3 {
            width: 100px;
            height: 100px;
            bottom: 20%;
            left: 20%;
          }

          .shape-4 {
            width: 40px;
            height: 40px;
            top: 30%;
            right: 30%;
          }

          .shape-5 {
            width: 70px;
            height: 70px;
            bottom: 40%;
            right: 10%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }

        /* Mobile-optimized particles */
        .particles {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: sparkle 3s linear infinite;
        }

        @media (min-width: 640px) {
          .particle {
            width: 4px;
            height: 4px;
          }
        }

        .particle:nth-child(odd) {
          animation-duration: 4s;
        }

        .particle:nth-child(even) {
          animation-duration: 2s;
        }

        ${[...Array(20)]
          .map(
            (_, i) => `
          .particle-${i + 1} {
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 3}s;
          }
        `,
          )
          .join("")}

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Mobile-first logo styling */
        .logo-container {
          perspective: 1000px;
        }

        .logo-wrapper {
          animation: logoFloat 3s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .logo-svg {
          filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
          animation: logoRotate 8s linear infinite;
          max-width: 100%;
          height: auto;
        }

        @media (min-width: 640px) {
          .logo-svg {
            filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.3));
          }
        }

        @media (min-width: 768px) {
          .logo-svg {
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
          }
        }

        .logo-svg rect {
          animation: strokePulse 2s ease-in-out infinite alternate;
        }

        /* Mobile-optimized text effects */
        .text-shadow-gold {
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.7), 0 0 15px rgba(255, 215, 0, 0.5);
          animation: goldGlow 2s ease-in-out infinite alternate;
        }

        @media (min-width: 640px) {
          .text-shadow-gold {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.5);
          }
        }

        @keyframes goldGlow {
          0% {
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.7), 0 0 15px rgba(255, 215, 0, 0.5);
          }
          100% {
            text-shadow: 0 0 12px rgba(255, 215, 0, 0.9), 0 0 25px rgba(255, 215, 0, 0.7);
          }
        }

        @media (min-width: 640px) {
          @keyframes goldGlow {
            0% {
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.5);
            }
            100% {
              text-shadow: 0 0 15px rgba(255, 215, 0, 0.9), 0 0 30px rgba(255, 215, 0, 0.7);
            }
          }
        }

        .jai-maa-text {
          animation: fadeInDown 1.5s ease-out;
          animation-fill-mode: both;
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 640px) {
          @keyframes fadeInDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        @keyframes strokePulse {
          0% {
            stroke-opacity: 0.8;
            stroke-width: 8;
          }
          100% {
            stroke-opacity: 1;
            stroke-width: 10;
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px) rotateX(0deg);
          }
          50% {
            transform: translateY(-8px) rotateX(5deg);
          }
        }

        @media (min-width: 640px) {
          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0px) rotateX(0deg);
            }
            50% {
              transform: translateY(-10px) rotateX(5deg);
            }
          }
        }

        @keyframes logoRotate {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        .shop-name {
          animation: textGlow 2s ease-in-out infinite alternate;
          line-height: 1.2;
        }

        .tagline {
          animation: fadeInUp 2s ease-out;
          animation-delay: 1s;
          animation-fill-mode: both;
          line-height: 1.3;
        }

        @keyframes textGlow {
          0% {
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
          }
          100% {
            text-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 0 35px rgba(255, 255, 255, 0.6);
          }
        }

        @media (min-width: 640px) {
          @keyframes textGlow {
            0% {
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            }
            100% {
              text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6);
            }
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 640px) {
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        .text-shadow {
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 640px) {
          .text-shadow {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          }
        }

        /* Mobile-optimized loader */
        .loader {
          position: relative;
          width: 50px;
          height: 50px;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .loader {
            width: 60px;
            height: 60px;
          }
        }

        .loader-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid transparent;
          border-top: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }

        @media (min-width: 640px) {
          .loader-ring {
            border-width: 3px;
            border-top: 3px solid rgba(255, 255, 255, 0.8);
          }
        }

        .loader-ring:nth-child(2) {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          animation-delay: 0.3s;
          border-top-color: rgba(255, 255, 255, 0.6);
        }

        .loader-ring:nth-child(3) {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          animation-delay: 0.6s;
          border-top-color: rgba(255, 255, 255, 0.4);
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loader-container {
          animation: fadeInUp 1s ease-out;
          animation-delay: 2s;
          animation-fill-mode: both;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .logo-svg,
          .shape,
          .particle,
          .loader-ring {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}