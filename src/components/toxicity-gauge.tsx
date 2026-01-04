import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressTrack,
  CircularProgressRange,
  CircularProgressValueText,
} from "@/components/ui/circular-progress";

interface ToxicityGaugeProps {
  score: number;
  isAnimating?: boolean;
}

const ToxicityGauge = ({ score, isAnimating = true }: ToxicityGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      const duration = 1500;
      const steps = 60;
      const increment = score / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);

      return () => {
        clearInterval(timer);
      };
    } else {
      setDisplayScore(score);
    }
  }, [score, isAnimating]);

  const getColor = () => {
    if (score <= 33) return "hsl(var(--toxic-green))";
    if (score <= 66) return "hsl(var(--toxic-orange))";
    return "hsl(var(--toxic-red))";
  };

  const getVerdict = () => {
    if (score <= 33) return { text: "All good vibes", label: "Chill" };
    if (score <= 66) return { text: "Kinda sus", label: "Mid" };
    return { text: "Major red flag", label: "Toxic" };
  };

  const getGlowClass = () => {
    if (score <= 33) return "glow-toxic-green";
    if (score <= 66) return "glow-toxic-orange";
    return "glow-toxic-red";
  };

  const getStrokeColor = () => {
    if (score <= 33) return "text-toxic-green";
    if (score <= 66) return "text-toxic-orange";
    return "text-toxic-red";
  };

  const verdict = getVerdict();

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Gauge Container */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("relative", getGlowClass(), "rounded-full p-4 transition-all duration-500")}
      >
        <CircularProgress
          value={displayScore}
          max={100}
          size={224}
          thickness={8}
        >
          <CircularProgressIndicator>
            <CircularProgressTrack className="text-muted" />
            <CircularProgressRange className={cn(getStrokeColor(), "transition-all duration-100")} />
          </CircularProgressIndicator>
          <CircularProgressValueText className="flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className={cn(
                "text-sm font-medium uppercase tracking-widest mb-1",
                `text-${getColor()}`
              )}
            >
              {verdict.label}
            </motion.span>
            <span className={cn(
              "text-4xl md:text-5xl font-serif tracking-tight",
              `text-${getColor()}`
            )}>
              {displayScore}%
            </span>
          </CircularProgressValueText>
        </CircularProgress>
      </motion.div>

      {/* Verdict text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-center"
      >
        <p className={cn(
          "text-2xl md:text-3xl font-serif tracking-tight",
          `text-${getColor()}`
        )}>
          {verdict.text}
        </p>
        <p className="text-muted-foreground mt-2 text-lg">
          Toxicity Level: {score <= 33 ? "Low" : score <= 66 ? "Medium" : "High"}
        </p>
      </motion.div>
    </div>
  );
};

export default ToxicityGauge;