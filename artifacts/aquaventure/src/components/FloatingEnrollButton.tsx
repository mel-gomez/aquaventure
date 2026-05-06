import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Waves } from "lucide-react";

const hideOnPaths = ["/login", "/register", "/portal", "/admin"];

export function FloatingEnrollButton() {
  const [location] = useLocation();
  const shouldHide = hideOnPaths.some((path) => location.startsWith(path));

  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, delay: 1.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,196,204,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-accent text-accent-foreground font-bold px-6 py-3.5 rounded-full shadow-xl text-sm cursor-pointer"
            >
              <Waves className="w-4 h-4" />
              Enroll Now
            </motion.button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
