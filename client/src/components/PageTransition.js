import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.61, 1, 0.88, 1],
    },
  },
};

export default function PageTransition({ children }) {
  return (
    <AnimatePresence>
      <motion.div initial="initial" animate="enter" variants={variants}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
