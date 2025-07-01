import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
}

export const Spotlight = ({ children, className = "" }: SpotlightProps) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {children}
    </div>
  );
};