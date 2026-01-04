import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ToxicityGaugeProps {
  score: number;
  isAnimating?: boolean;
}

const ToxicityGauge = ({ score, isAnimating = true }: ToxicityGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(283);
  
  const circumference = 283;
  const targetOffset = circumference - (score / 100) * circumference;

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

      const strokeTimer = setTimeout(() => {
        setAnimatedOffset(targetOffset);
      }, 100);

      return () => {
        clearInterval(timer);
        clearTimeout(strokeTimer);
      };
    } else {
      setDisplayScore(score);
      setAnimatedOffset(targetOffset);
    }
  }, [score, isAnimating, targetOffset]);

  const getColor = () => {
    if (score <= 33) return "toxic-green";
    if (score <= 66) return "toxic-orange";
    return "toxic-red";
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
    if (score <= 33) return "hsl(var(--toxic-green))";
    if (score <= 66) return "hsl(var(--toxic-orange))";
    return "hsl(var(--toxic-red))";
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
        <svg
          className="transform -rotate-90 w-48 h-48 md:w-56 md:h-56"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
          />
          {/* Animated progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getStrokeColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            className="transition-all duration-[1500ms] ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
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
        </div>
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