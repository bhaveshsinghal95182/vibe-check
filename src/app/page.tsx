"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import TextInput from "@/components/text-input";
import ToxicityGauge from "@/components/toxicity-gauge";
import ToxicityBreakdown from "@/components/toxicity-breakdown";
import ShareableResult from "@/components/shareable-result";
import { Sparkles } from "lucide-react";
import { ToxicityResult } from "@/types";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ToxicityResult | null>(null);

  const handleAnalyze = async (text: string, image?: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, image }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const analysis: ToxicityResult = await response.json();
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl md:text-7xl font-serif tracking-tight text-foreground"
          >
            Vibe Check
          </motion.h1>
        </motion.header>

        {/* Main Content */}
        <main className="space-y-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border shadow-xl"
              >
                <TextInput onAnalyze={handleAnalyze} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Gauge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border shadow-xl"
                >
                  <ToxicityGauge score={result.score} />
                </motion.div>

                {/* Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <ToxicityBreakdown breakdown={result.breakdown} />
                </motion.div>

                {/* Shareable Result */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <ShareableResult score={result.score} breakdown={result.breakdown} />
                </motion.div>

                {/* Reset Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="w-full py-4 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-2xl border-2 border-dashed border-border hover:border-primary/50"
                >
                  Check another message
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p className="opacity-60">Just for fun</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;