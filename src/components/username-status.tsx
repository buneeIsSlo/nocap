import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function UsernameStatus({
  status,
}: {
  status: "idle" | "checking" | "available" | "taken" | "error";
}) {
  return (
    <AnimatePresence mode="wait">
      {status === "checking" && (
        <motion.span
          key="checking"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1 text-gray-400"
        >
          <Loader2 className="size-4 animate-spin" /> Checking...
        </motion.span>
      )}
      {status === "available" && (
        <motion.span
          key="available"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1 text-green-600"
        >
          <CheckCircle2 className="size-4" /> Username is available
        </motion.span>
      )}
      {status === "taken" && (
        <motion.span
          key="taken"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1 text-red-600"
        >
          <XCircle className="size-4" /> Username is taken
        </motion.span>
      )}
      {status === "error" && (
        <motion.span
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1 text-red-600"
        >
          <XCircle className="size-4" /> Error checking username
        </motion.span>
      )}
    </AnimatePresence>
  );
}
