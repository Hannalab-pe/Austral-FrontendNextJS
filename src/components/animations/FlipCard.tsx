import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FlipCard({
  isFlipped,
  front,
  back,
  className = "",
  duration = 0.6,
}: {
  isFlipped: boolean;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <div className={`perspective-1000 ${className}`} style={{ perspective: 1000 }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration }}
      >
        <div className="absolute w-full h-full backface-hidden">
          {front}
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          {back}
        </div>
      </motion.div>
    </div>
  );
}
