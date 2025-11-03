import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Shake({
  children,
  trigger = false,
  className = "",
}: {
  children: ReactNode;
  trigger?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={trigger ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
