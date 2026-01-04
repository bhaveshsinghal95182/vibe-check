import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { 
  Flame, 
  AlertTriangle, 
  MessageSquare, 
  Frown, 
  Angry,
  ThumbsDown,
  Skull,
  Zap
} from "lucide-react";

interface ToxicityType {
  type: string;
  severity: "low" | "medium" | "high";
  detected: boolean;
}

interface ToxicityBreakdownProps {
  breakdown: ToxicityType[];
}

const iconMap: Record<string, React.ReactNode> = {
  "Insults": <Angry className="w-4 h-4" />,
  "Threats": <Skull className="w-4 h-4" />,
  "Sarcasm": <MessageSquare className="w-4 h-4" />,
  "Passive-aggressive": <ThumbsDown className="w-4 h-4" />,
  "Gaslighting": <Flame className="w-4 h-4" />,
  "Condescending": <AlertTriangle className="w-4 h-4" />,
  "Manipulation": <Zap className="w-4 h-4" />,
  "Negativity": <Frown className="w-4 h-4" />,
};

const ToxicityBreakdown = ({ breakdown }: ToxicityBreakdownProps) => {
  const detectedTypes = breakdown.filter((item) => item.detected);
  
  if (detectedTypes.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h3 className="font-serif text-xl tracking-tight mb-4">Breakdown</h3>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <p className="text-lg">No toxic patterns detected. This message is clean.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="font-serif text-xl tracking-tight mb-4">Breakdown</h3>
      <div className="flex flex-wrap gap-3">
        {detectedTypes.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors",
              "border-2",
              item.severity === "low" && "bg-toxic-green/10 border-toxic-green text-toxic-green",
              item.severity === "medium" && "bg-toxic-orange/10 border-toxic-orange text-toxic-orange",
              item.severity === "high" && "bg-toxic-red/10 border-toxic-red text-toxic-red"
            )}
          >
            {iconMap[item.type] || <AlertTriangle className="w-4 h-4" />}
            <span>{item.type}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ToxicityBreakdown;