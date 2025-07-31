"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export type AnimationType =
  | "particles"
  | "waves"
  | "geometric"
  | "gradient-flow"
  | "ripples"
  | "stars"
  | "bubbles"
  | "matrix-rain"
  | "dna-helix"
  | "constellation"
  | "liquid-morphing"
  | "circuit-board"
  | "spiral-galaxy"
  | "neural-network"

export type TransitionStyle =
  | "fade"
  | "scale"
  | "slide-up"
  | "slide-down"
  | "zoom-blur"
  | "rotate-fade"
  | "elastic"
  | "bounce"

interface SplashScreenProps {
  shopName?: string
  slogan?: string
  logo?: string
  logoSvg?: string
  logoWidth?: number // Add this
  logoHeight?: number // Add this
  backgroundColor?: string
  textColor?: string
  animationType?: AnimationType
  transitionStyle?: TransitionStyle
  onComplete?: () => void
  duration?: number
}

// Keep all animation components the same as before for brevity...
const ParticlesAnimation = ({ textColor }: { textColor: string }) => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 2,
  }))

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: textColor,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0.3, 0.6, 0],
            scale: [0, 1, 1.2, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </>
  )
}

const WavesAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${textColor}30 0%, ${textColor}10 40%, transparent 70%)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 1.5],
            opacity: [0, 0.4, 0.1, 0],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: i * 1.2,
          }}
        />
      ))}
    </>
  )
}

const GeometricAnimation = ({ textColor }: { textColor: string }) => {
  const shapes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 30,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    rotation: Math.random() * 360,
    delay: Math.random() * 3,
    shape: i % 3,
  }))

  return (
    <>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{
            rotate: [shape.rotation, shape.rotation + 360],
            scale: [0, 1, 1.3, 1],
            opacity: [0, 0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: shape.delay,
          }}
        >
          {shape.shape === 0 && <div className="w-full h-full" style={{ backgroundColor: `${textColor}20` }} />}
          {shape.shape === 1 && (
            <div
              className="w-full h-full"
              style={{
                backgroundColor: `${textColor}20`,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          )}
          {shape.shape === 2 && (
            <div className="w-full h-full rounded-full" style={{ backgroundColor: `${textColor}20` }} />
          )}
        </motion.div>
      ))}
    </>
  )
}

const GradientFlowAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, ${textColor}40, transparent, ${textColor}20, transparent, ${textColor}40)`,
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(-45deg, transparent, ${textColor}15, transparent, ${textColor}25, transparent)`,
          backgroundSize: "300% 300%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </>
  )
}

const RipplesAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: i * 0.8,
          }}
        >
          <div className="w-32 h-32 rounded-full border-2" style={{ borderColor: `${textColor}60` }} />
        </motion.div>
      ))}
    </>
  )
}

const StarsAnimation = ({ textColor }: { textColor: string }) => {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 1,
  }))

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1, 1.5, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: star.delay,
          }}
        >
          <div
            className="transform rotate-45"
            style={{
              width: star.size,
              height: star.size,
              backgroundColor: textColor,
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        </motion.div>
      ))}
    </>
  )
}

const BubblesAnimation = ({ textColor }: { textColor: string }) => {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 50 + 15,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
  }))

  return (
    <>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full border-2"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            borderColor: `${textColor}60`,
            backgroundColor: `${textColor}10`,
          }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0.8, 0.6, 0],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: bubble.delay,
          }}
        />
      ))}
    </>
  )
}

// Simplified versions of other animations for brevity
const MatrixRainAnimation = ({ textColor }: { textColor: string }) => {
  const columns = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: i * 4 + Math.random() * 2,
    delay: Math.random() * 3,
    speed: Math.random() * 3 + 2,
  }))

  return (
    <>
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute"
          style={{ left: `${column.x}%` }}
          initial={{ y: "-100px", opacity: 0 }}
          animate={{
            y: "100vh",
            opacity: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: column.speed,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: column.delay,
          }}
        >
          <div className="flex flex-col space-y-1">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                className="w-3 h-5 text-xs font-mono flex items-center justify-center rounded"
                style={{
                  backgroundColor: `${textColor}${Math.floor((1 - i * 0.05) * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  color: i < 3 ? "#000" : "transparent",
                }}
              >
                {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </>
  )
}

// Keep other animations the same for brevity...
const DNAHelixAnimation = ({ textColor }: { textColor: string }) => {
  const helixPoints = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    angle: (i * 24) % 360,
    y: i * 4,
    side: i % 2,
  }))

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{ rotateY: 360 }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {helixPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-4 h-4 rounded-full"
            style={{
              backgroundColor: `${textColor}80`,
              left: point.side === 0 ? "50px" : "-50px",
              top: `${point.y - 150}px`,
              transform: `rotateY(${point.angle}deg) translateZ(${point.side === 0 ? "40px" : "-40px"})`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: point.id * 0.1,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

const ConstellationAnimation = ({ textColor }: { textColor: string }) => {
  const stars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: Math.random() * 5 + 3,
  }))

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: textColor,
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.7, 1],
            scale: [0, 1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.id * 0.3,
          }}
        />
      ))}

      {stars.map((star, i) => {
        const nextStar = stars[(i + 1) % stars.length]
        const length = Math.sqrt(Math.pow(nextStar.x - star.x, 2) + Math.pow(nextStar.y - star.y, 2))
        const angle = Math.atan2(nextStar.y - star.y, nextStar.x - star.x) * (180 / Math.PI)

        return (
          <motion.div
            key={`line-${i}`}
            className="absolute"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${length}%`,
              height: "2px",
              backgroundColor: `${textColor}60`,
              transformOrigin: "0 0",
              transform: `rotate(${angle}deg)`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 1, 0],
              opacity: [0, 0.6, 0.4, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
            }}
          />
        )
      })}
    </>
  )
}

const LiquidMorphingAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute blur-2xl"
          style={{
            backgroundColor: `${textColor}30`,
            left: `${15 + i * 25}%`,
            top: `${25 + i * 15}%`,
          }}
          animate={{
            borderRadius: [
              "60% 40% 30% 70%/60% 30% 70% 40%",
              "30% 60% 70% 40%/50% 60% 30% 60%",
              "40% 30% 60% 70%/40% 70% 60% 30%",
              "60% 40% 30% 70%/60% 30% 70% 40%",
            ],
            width: ["150px", "220px", "180px", "150px"],
            height: ["180px", "150px", "200px", "180px"],
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            opacity: [0.3, 0.5, 0.4, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
        />
      ))}
    </>
  )
}

const CircuitBoardAnimation = ({ textColor }: { textColor: string }) => {
  const circuits = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    width: Math.random() * 120 + 60,
    height: 3,
    direction: Math.random() > 0.5 ? "horizontal" : "vertical",
  }))

  return (
    <>
      {circuits.map((circuit) => (
        <div key={circuit.id}>
          <motion.div
            className="absolute"
            style={{
              left: `${circuit.x}%`,
              top: `${circuit.y}%`,
              width: circuit.direction === "horizontal" ? `${circuit.width}px` : "3px",
              height: circuit.direction === "horizontal" ? "3px" : `${circuit.width}px`,
              backgroundColor: `${textColor}40`,
            }}
            initial={{
              opacity: 0,
              scaleX: circuit.direction === "horizontal" ? 0 : 1,
              scaleY: circuit.direction === "vertical" ? 0 : 1,
            }}
            animate={{
              opacity: [0, 0.6, 0.4, 0.6],
              scaleX: circuit.direction === "horizontal" ? [0, 1, 1, 1] : 1,
              scaleY: circuit.direction === "vertical" ? [0, 1, 1, 1] : 1,
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: circuit.id * 0.3,
            }}
          />

          <motion.div
            className="absolute w-4 h-4 rounded-full"
            style={{
              backgroundColor: textColor,
              left: `${circuit.x}%`,
              top: `${circuit.y}%`,
            }}
            animate={circuit.direction === "horizontal" ? { x: [0, circuit.width, 0] } : { y: [0, circuit.width, 0] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: circuit.id * 0.5,
            }}
          />
        </div>
      ))}
    </>
  )
}

const SpiralGalaxyAnimation = ({ textColor }: { textColor: string }) => {
  const spiralArms = Array.from({ length: 4 }, (_, armIndex) =>
    Array.from({ length: 25 }, (_, i) => ({
      id: `${armIndex}-${i}`,
      angle: armIndex * 90 + i * 14.4,
      radius: i * 6 + 25,
      size: Math.max(2, 5 - i * 0.12),
      opacity: Math.max(0.3, 1 - i * 0.03),
    })),
  ).flat()

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {spiralArms.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: textColor,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              left: `${Math.cos((particle.angle * Math.PI) / 180) * particle.radius}px`,
              top: `${Math.sin((particle.angle * Math.PI) / 180) * particle.radius}px`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [particle.opacity, particle.opacity * 1.6, particle.opacity],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.radius * 0.03,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

const NeuralNetworkAnimation = ({ textColor }: { textColor: string }) => {
  const nodes = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: Math.random() * 8 + 5,
  }))

  return (
    <>
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: textColor,
            width: node.size,
            height: node.size,
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1.5, 1],
            opacity: [0, 0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: node.id * 0.2,
          }}
        />
      ))}

      {nodes.map((node, i) => {
        const nearbyNodes = nodes.filter((otherNode, j) => {
          if (i === j) return false
          const distance = Math.sqrt(Math.pow(otherNode.x - node.x, 2) + Math.pow(otherNode.y - node.y, 2))
          return distance < 35
        })

        return nearbyNodes.map((nearbyNode, j) => {
          const length = Math.sqrt(Math.pow(nearbyNode.x - node.x, 2) + Math.pow(nearbyNode.y - node.y, 2))
          const angle = Math.atan2(nearbyNode.y - node.y, nearbyNode.x - node.x) * (180 / Math.PI)

          return (
            <motion.div
              key={`${i}-${j}`}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${length}%`,
                height: "2px",
                backgroundColor: `${textColor}60`,
                transformOrigin: "0 0",
                transform: `rotate(${angle}deg)`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 1, 0],
                opacity: [0, 0.8, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: (i + j) * 0.15,
              }}
            />
          )
        })
      })}
    </>
  )
}

export default function SplashScreen({
  shopName = "Your Shop",
  slogan = "Quality & Excellence",
  logo = "/placeholder.svg?height=80&width=80",
  logoSvg = "",
  logoWidth = 80, // Add this
  logoHeight = 80, // Add this
  backgroundColor = "#0f172a",
  textColor = "#f1f5f9",
  animationType = "particles",
  transitionStyle = "fade",
  onComplete,
  duration = 3000,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete?.(), 800)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  const renderAnimation = () => {
    const props = { textColor }

    switch (animationType) {
      case "particles":
        return <ParticlesAnimation {...props} />
      case "waves":
        return <WavesAnimation {...props} />
      case "geometric":
        return <GeometricAnimation {...props} />
      case "gradient-flow":
        return <GradientFlowAnimation {...props} />
      case "ripples":
        return <RipplesAnimation {...props} />
      case "stars":
        return <StarsAnimation {...props} />
      case "bubbles":
        return <BubblesAnimation {...props} />
      case "matrix-rain":
        return <MatrixRainAnimation {...props} />
      case "dna-helix":
        return <DNAHelixAnimation {...props} />
      case "constellation":
        return <ConstellationAnimation {...props} />
      case "liquid-morphing":
        return <LiquidMorphingAnimation {...props} />
      case "circuit-board":
        return <CircuitBoardAnimation {...props} />
      case "spiral-galaxy":
        return <SpiralGalaxyAnimation {...props} />
      case "neural-network":
        return <NeuralNetworkAnimation {...props} />
      default:
        return <ParticlesAnimation {...props} />
    }
  }

  const getTransitionVariants = () => {
    switch (transitionStyle) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 },
        }
      case "slide-up":
        return {
          initial: { opacity: 0, y: "100vh" },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: "-100vh" },
        }
      case "slide-down":
        return {
          initial: { opacity: 0, y: "-100vh" },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: "100vh" },
        }
      case "zoom-blur":
        return {
          initial: { opacity: 0, scale: 0.5, filter: "blur(20px)" },
          animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
          exit: { opacity: 0, scale: 1.5, filter: "blur(20px)" },
        }
      case "rotate-fade":
        return {
          initial: { opacity: 0, rotate: -180, scale: 0.5 },
          animate: { opacity: 1, rotate: 0, scale: 1 },
          exit: { opacity: 0, rotate: 180, scale: 0.5 },
        }
      case "elastic":
        return {
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0 },
        }
      case "bounce":
        return {
          initial: { opacity: 0, y: -100, scale: 0.3 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 100, scale: 0.3 },
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
    }
  }

  const getTransitionConfig = () => {
    switch (transitionStyle) {
      case "elastic":
        return {
          duration: 1.2,
          ease: [0.68, -0.55, 0.265, 1.55],
          exit: { duration: 0.8, ease: "easeInOut" },
        }
      case "bounce":
        return {
          duration: 1.0,
          ease: [0.68, -0.55, 0.265, 1.55],
          exit: { duration: 0.6, ease: "easeIn" },
        }
      case "slide-up":
      case "slide-down":
        return {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          exit: { duration: 0.6, ease: "easeInOut" },
        }
      case "zoom-blur":
        return {
          duration: 1.0,
          ease: "easeOut",
          exit: { duration: 0.8, ease: "easeIn" },
        }
      case "rotate-fade":
        return {
          duration: 1.2,
          ease: "easeOut",
          exit: { duration: 0.8, ease: "easeIn" },
        }
      default:
        return {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          exit: { duration: 0.8, ease: "easeInOut" },
        }
    }
  }

  const variants = getTransitionVariants()
  const transitionConfig = getTransitionConfig()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={transitionConfig}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background with Gradient */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: `radial-gradient(circle at 30% 20%, ${backgroundColor}dd 0%, ${backgroundColor} 50%, ${backgroundColor}ee 100%)`,
            }}
          />

          {/* Secondary gradient layer */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                `linear-gradient(45deg, ${backgroundColor}00 0%, ${textColor}05 50%, ${backgroundColor}00 100%)`,
                `linear-gradient(135deg, ${backgroundColor}00 0%, ${textColor}08 50%, ${backgroundColor}00 100%)`,
                `linear-gradient(225deg, ${backgroundColor}00 0%, ${textColor}05 50%, ${backgroundColor}00 100%)`,
                `linear-gradient(315deg, ${backgroundColor}00 0%, ${textColor}08 50%, ${backgroundColor}00 100%)`,
              ],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Enhanced Stylish Background Elements */}
          <div className="absolute inset-0">
            {/* Primary Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${textColor}25 0%, ${textColor}15 30%, ${textColor}08 60%, transparent 80%)`,
                width: "400px",
                height: "400px",
              }}
              animate={{
                scale: [1, 1.4, 1.2, 1],
                x: [0, 80, -30, 0],
                y: [0, -50, 30, 0],
                opacity: [0.3, 0.6, 0.4, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-1/3 right-1/4 rounded-full blur-2xl"
              style={{
                background: `radial-gradient(circle, ${textColor}20 0%, ${textColor}12 40%, ${textColor}06 70%, transparent 90%)`,
                width: "350px",
                height: "350px",
              }}
              animate={{
                scale: [1, 1.6, 1.3, 1],
                x: [0, -70, 40, 0],
                y: [0, 60, -40, 0],
                opacity: [0.25, 0.5, 0.35, 0.25],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />

            {/* Secondary Accent Orbs */}
            <motion.div
              className="absolute top-1/2 left-1/6 rounded-full blur-xl"
              style={{
                background: `radial-gradient(circle, ${textColor}18 0%, ${textColor}10 50%, transparent 80%)`,
                width: "200px",
                height: "200px",
              }}
              animate={{
                scale: [1, 1.3, 1.1, 1],
                x: [0, 40, -20, 0],
                y: [0, -30, 15, 0],
                opacity: [0.2, 0.4, 0.3, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            <motion.div
              className="absolute top-1/3 right-1/6 rounded-full blur-xl"
              style={{
                background: `radial-gradient(circle, ${textColor}15 0%, ${textColor}08 50%, transparent 80%)`,
                width: "180px",
                height: "180px",
              }}
              animate={{
                scale: [1, 1.4, 1.2, 1],
                x: [0, -35, 25, 0],
                y: [0, 40, -25, 0],
                opacity: [0.18, 0.35, 0.25, 0.18],
              }}
              transition={{
                duration: 7,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 3,
              }}
            />

            {/* Central Ambient Orb */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${textColor}12 0%, ${textColor}06 40%, transparent 70%)`,
                width: "500px",
                height: "500px",
              }}
              animate={{
                scale: [1, 1.2, 1.1, 1],
                opacity: [0.1, 0.2, 0.15, 0.1],
              }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 4,
              }}
            />

            {/* Floating Geometric Accents */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`accent-${i}`}
                className="absolute rounded-full"
                style={{
                  background: `${textColor}20`,
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`,
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  filter: "blur(1px)",
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 40 - 20, 0],
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}

            {/* Enhanced Gradient Waves */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from 0deg at 30% 30%, ${textColor}08 0deg, transparent 60deg, ${textColor}12 120deg, transparent 180deg, ${textColor}06 240deg, transparent 300deg, ${textColor}10 360deg)`,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Selected Animation Type */}
            {renderAnimation()}
          </div>

          {/* Enhanced Logo with SVG Support */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.5,
            }}
            className="relative mb-6"
          >
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-2 opacity-30"
              style={{
                borderColor: textColor,
                width: `${logoWidth + 60}px`,
                height: `${logoHeight + 60}px`,
                left: `-${30}px`,
                top: `-${30}px`,
              }}
            />

            {/* Middle pulsing ring */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full border opacity-25"
              style={{
                borderColor: textColor,
                width: `${logoWidth + 40}px`,
                height: `${logoHeight + 40}px`,
                left: `-${20}px`,
                top: `-${20}px`,
              }}
            />

            {/* Inner glowing ring */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full border opacity-40"
              style={{
                borderColor: textColor,
                width: `${logoWidth + 20}px`,
                height: `${logoHeight + 20}px`,
                left: `-${10}px`,
                top: `-${10}px`,
                boxShadow: `0 0 20px ${textColor}40`,
              }}
            />

            <div className="relative z-10 p-4">
              {logoSvg ? (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: `${logoWidth}px`,
                    height: `${logoHeight}px`,
                    filter: `drop-shadow(0 0 10px ${textColor}60)`,
                  }}
                  dangerouslySetInnerHTML={{ __html: logoSvg }}
                />
              ) : (
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  width={logoWidth}
                  height={logoHeight}
                  className="object-contain"
                  style={{
                    width: `${logoWidth}px`,
                    height: `${logoHeight}px`,
                    filter: `drop-shadow(0 0 10px ${textColor}60)`,
                  }}
                />
              )}
            </div>
          </motion.div>

          {/* Shop Name */}
          <motion.div
            className="relative z-10 flex flex-col items-center space-y-6 px-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-3"
              style={{
                color: textColor,
                textShadow: `0 0 30px ${textColor}40, 0 0 60px ${textColor}20`,
              }}
              animate={{
                textShadow: [
                  `0 0 30px ${textColor}40, 0 0 60px ${textColor}20`,
                  `0 0 40px ${textColor}60, 0 0 80px ${textColor}30`,
                  `0 0 30px ${textColor}40, 0 0 60px ${textColor}20`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {shopName}
            </motion.h1>

            {/* Slogan */}
            <motion.p
              className="text-lg md:text-xl font-light opacity-80 tracking-wide"
              style={{ color: textColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {slogan}
            </motion.p>
          </motion.div>

          {/* Loading Animation at Bottom */}
          <motion.div
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <div className="flex justify-center space-x-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: textColor }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 1, 0.4],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <motion.p
              className="text-sm mt-3 opacity-60 tracking-wider"
              style={{ color: textColor }}
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Loading...
            </motion.p>
          </motion.div>

          {/* Enhanced Bottom Gradient */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{
              background: `linear-gradient(to top, ${textColor}15, ${textColor}08, transparent)`,
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Vignette Effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, transparent 40%, ${backgroundColor}40 100%)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
