import { motion, AnimatePresence } from "framer-motion";

export const ParticlesAnimation = ({ textColor }: { textColor: string }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30"
          style={{
            backgroundColor: textColor,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
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
  );
};

export const WavesAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${textColor} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </>
  );
};

export const GeometricAnimation = ({ textColor }: { textColor: string }) => {
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
  }));

  return (
    <>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute opacity-10"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            backgroundColor: textColor,
          }}
          animate={{
            rotate: [shape.rotation, shape.rotation + 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: shape.delay,
          }}
        />
      ))}
    </>
  );
};

export const GradientFlowAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <motion.div
      className="absolute inset-0 opacity-20"
      style={{
        background: `linear-gradient(45deg, ${textColor}40, transparent, ${textColor}20, transparent, ${textColor}40)`,
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
};

export const RipplesAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: i * 0.7,
          }}
        >
          <div
            className="w-32 h-32 rounded-full border-2"
            style={{ borderColor: textColor }}
          />
        </motion.div>
      ))}
    </>
  );
};

export const StarsAnimation = ({ textColor }: { textColor: string }) => {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1,
  }));

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
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
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
  );
};

export const BubblesAnimation = ({ textColor }: { textColor: string }) => {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 10,
    x: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full opacity-15 border-2"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            borderColor: textColor,
            backgroundColor: `${textColor}10`,
          }}
          initial={{ y: "100vh" }}
          animate={{ y: "-100px" }}
          transition={{
            duration: bubble.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: bubble.delay,
          }}
        />
      ))}
    </>
  );
};

export const MatrixRainAnimation = ({ textColor }: { textColor: string }) => {
  const columns = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: i * 5 + Math.random() * 3,
    delay: Math.random() * 2,
    speed: Math.random() * 2 + 1,
  }));

  return (
    <>
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute opacity-40"
          style={{ left: `${column.x}%` }}
          initial={{ y: "-100px" }}
          animate={{ y: "100vh" }}
          transition={{
            duration: column.speed,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: column.delay,
          }}
        >
          <div className="flex flex-col space-y-2">
            {Array.from({ length: 15 }, (_, i) => (
              <motion.div
                key={i}
                className="w-2 h-4 text-xs font-mono flex items-center justify-center"
                style={{
                  backgroundColor: textColor,
                  opacity: 1 - i * 0.06,
                }}
                animate={{
                  opacity: [1 - i * 0.06, 0.8 - i * 0.06, 1 - i * 0.06],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
              >
                {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </>
  );
};

export const DNAHelixAnimation = ({ textColor }: { textColor: string }) => {
  const helixPoints = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    angle: (i * 18) % 360,
    y: i * 3,
    side: i % 2,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{ rotateY: 360 }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {helixPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-3 h-3 rounded-full opacity-60"
            style={{
              backgroundColor: textColor,
              left: point.side === 0 ? "40px" : "-40px",
              top: `${point.y - 200}px`,
              transform: `rotateY(${point.angle}deg) translateZ(${
                point.side === 0 ? "30px" : "-30px"
              })`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: point.id * 0.1,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const ConstellationAnimation = ({ textColor }: { textColor: string }) => {
  const stars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: Math.random() * 4 + 2,
  }));

  return (
    <>
      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full opacity-80"
          style={{
            backgroundColor: textColor,
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.id * 0.3,
          }}
        />
      ))}

      {/* Connecting Lines */}
      {stars.map((star, i) => {
        const nextStar = stars[(i + 1) % stars.length];
        const length = Math.sqrt(
          Math.pow(nextStar.x - star.x, 2) + Math.pow(nextStar.y - star.y, 2)
        );
        const angle =
          Math.atan2(nextStar.y - star.y, nextStar.x - star.x) *
          (180 / Math.PI);

        return (
          <motion.div
            key={`line-${i}`}
            className="absolute opacity-30"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${length}%`,
              height: "1px",
              backgroundColor: textColor,
              transformOrigin: "0 0",
              transform: `rotate(${angle}deg)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
        );
      })}
    </>
  );
};

export const LiquidMorphingAnimation = ({ textColor }: { textColor: string }) => {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute opacity-20 blur-xl"
          style={{
            backgroundColor: textColor,
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            borderRadius: [
              "60% 40% 30% 70%/60% 30% 70% 40%",
              "30% 60% 70% 40%/50% 60% 30% 60%",
              "40% 30% 60% 70%/40% 70% 60% 30%",
              "60% 40% 30% 70%/60% 30% 70% 40%",
            ],
            width: ["120px", "180px", "140px", "120px"],
            height: ["140px", "120px", "160px", "140px"],
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </>
  );
};

export const CircuitBoardAnimation = ({ textColor }: { textColor: string }) => {
  const circuits = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    width: Math.random() * 100 + 50,
    height: 2,
    direction: Math.random() > 0.5 ? "horizontal" : "vertical",
  }));

  return (
    <>
      {circuits.map((circuit) => (
        <div key={circuit.id}>
          {/* Circuit Line */}
          <div
            className="absolute opacity-30"
            style={{
              left: `${circuit.x}%`,
              top: `${circuit.y}%`,
              width:
                circuit.direction === "horizontal"
                  ? `${circuit.width}px`
                  : "2px",
              height:
                circuit.direction === "horizontal"
                  ? "2px"
                  : `${circuit.width}px`,
              backgroundColor: textColor,
            }}
          />

          {/* Flowing Energy */}
          <motion.div
            className="absolute w-3 h-3 rounded-full opacity-80"
            style={{
              backgroundColor: textColor,
              left: `${circuit.x}%`,
              top: `${circuit.y}%`,
            }}
            animate={
              circuit.direction === "horizontal"
                ? { x: [0, circuit.width, 0] }
                : { y: [0, circuit.width, 0] }
            }
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: circuit.id * 0.4,
            }}
          />

          {/* Circuit Nodes */}
          <div
            className="absolute w-2 h-2 rounded-full opacity-60"
            style={{
              backgroundColor: textColor,
              left: `${circuit.x}%`,
              top: `${circuit.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      ))}
    </>
  );
};

export const SpiralGalaxyAnimation = ({ textColor }: { textColor: string }) => {
  const spiralArms = Array.from({ length: 3 }, (_, armIndex) =>
    Array.from({ length: 20 }, (_, i) => ({
      id: `${armIndex}-${i}`,
      angle: armIndex * 120 + i * 18,
      radius: i * 8 + 20,
      size: Math.max(1, 4 - i * 0.15),
      opacity: Math.max(0.2, 1 - i * 0.04),
    }))
  ).flat();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
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
              left: `${
                Math.cos((particle.angle * Math.PI) / 180) * particle.radius
              }px`,
              top: `${
                Math.sin((particle.angle * Math.PI) / 180) * particle.radius
              }px`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [
                particle.opacity,
                particle.opacity * 1.5,
                particle.opacity,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.radius * 0.02,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const NeuralNetworkAnimation = ({ textColor }: { textColor: string }) => {
  const nodes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: Math.random() * 6 + 4,
  }));

  return (
    <>
      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full opacity-70"
          style={{
            backgroundColor: textColor,
            width: node.size,
            height: node.size,
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: node.id * 0.2,
          }}
        />
      ))}

      {/* Connections */}
      {nodes.map((node, i) => {
        const nearbyNodes = nodes.filter((otherNode, j) => {
          if (i === j) return false;
          const distance = Math.sqrt(
            Math.pow(otherNode.x - node.x, 2) +
              Math.pow(otherNode.y - node.y, 2)
          );
          return distance < 30;
        });

        return nearbyNodes.map((nearbyNode, j) => {
          const length = Math.sqrt(
            Math.pow(nearbyNode.x - node.x, 2) +
              Math.pow(nearbyNode.y - node.y, 2)
          );
          const angle =
            Math.atan2(nearbyNode.y - node.y, nearbyNode.x - node.x) *
            (180 / Math.PI);

          return (
            <motion.div
              key={`${i}-${j}`}
              className="absolute opacity-40"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${length}%`,
                height: "1px",
                backgroundColor: textColor,
                transformOrigin: "0 0",
                transform: `rotate(${angle}deg)`,
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: (i + j) * 0.1,
              }}
            />
          );
        });
      })}
    </>
  );
};