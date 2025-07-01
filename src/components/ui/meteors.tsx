import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Meteor {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export const Meteors = ({ number = 20 }: { number?: number }) => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    const newMeteors = Array.from({ length: number }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 1,
    }));
    setMeteors(newMeteors);
  }, [number]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute w-0.5 h-20 bg-gradient-to-b from-white to-transparent"
          style={{
            left: `${meteor.x}%`,
            top: "-20px",
          }}
          animate={{
            y: ["0vh", "100vh"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};