import { motion } from "framer-motion";
import { ReactNode } from "react";

export function ChartGrow({
  children,
  duration = 0.8,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      style={{ transformOrigin: "bottom" }}
    >
      {children}
    </motion.div>
  );
}
