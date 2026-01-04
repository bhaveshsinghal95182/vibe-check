"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface ShareableResultProps {
  score: number;
  breakdown: { type: string; severity: string; detected: boolean }[];
}

const ShareableResult = ({ score, breakdown }: ShareableResultProps) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getVerdict = () => {
    if (score <= 33) return "All good vibes";
    if (score <= 66) return "Kinda sus";
    return "Major red flag";
  };

  const getLabel = () => {
    if (score <= 33) return "Chill";
    if (score <= 66) return "Mid";
    return "Toxic";
  };

  const getBgColor = () => {
    if (score <= 33) return "#166534";
    if (score <= 66) return "#ea580c";
    return "#dc2626";
  };

  const detectedTypes = breakdown.filter((item) => item.detected);

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: "#09090b",
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) throw new Error("Failed to generate image blob");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = `vibe-check-${score}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyResult = async () => {
    const resultText = `
VIBE CHECK RESULT
━━━━━━━━━━━━━━━━━━
Score: ${score}% (${getLabel()})
${getVerdict()}
${detectedTypes.length > 0 ? `\nDetected: ${detectedTypes.map(t => t.type).join(", ")}` : "\nNo toxic patterns detected."}
━━━━━━━━━━━━━━━━━━
Check your vibes at vibecheck.app
    `.trim();

    await navigator.clipboard.writeText(resultText);
    toast.success("Result copied to clipboard!");
  };

  const handleShare = async () => {
    if (!resultRef.current) {
      handleCopyResult();
      return;
    }

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: "#09090b",
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          handleCopyResult();
          return;
        }

        const file = new File([blob], "vibe-check.png", { type: "image/png" });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "Vibe Check Result",
              text: `Toxicity Score: ${score}% - ${getVerdict()}`,
              files: [file],
            });
            toast.success("Shared successfully!");
          } catch (err) {
            handleCopyResult();
          }
        } else {
          handleCopyResult();
        }
      }, "image/png");
    } catch (error) {
      handleCopyResult();
    }
  };

  return (
    <div>
      {/* Shareable card - using inline styles for html2canvas compatibility */}
      <div ref={resultRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ backgroundColor: getBgColor() }}
        >
          <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span 
              className="font-serif text-xl tracking-tight"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              Vibe Check
            </span>
            <span 
              className="text-sm font-medium uppercase tracking-widest"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {getLabel()}
            </span>
          </div>
          
          <div className="text-center py-6">
            <span 
              className="text-7xl md:text-8xl font-serif tracking-tight"
              style={{ color: "#ffffff" }}
            >
              {score}%
            </span>
          </div>
          
          <p 
            className="text-2xl font-serif tracking-tight text-center mb-4"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            {getVerdict()}
          </p>
          
          {detectedTypes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {detectedTypes.slice(0, 4).map((type) => (
                <span
                  key={type.type}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "#ffffff" }}
                >
                  {type.type}
                </span>
              ))}
            </div>
          )}

          <div 
            className="text-center mt-6 pt-4"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}
          >
            <span 
              className="text-xs uppercase tracking-widest"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              vibecheck.app
            </span>
          </div>
        </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleShare}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            variant="outline"
          >
            <Download className="w-4 h-4" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleCopyResult}
            variant="outline"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ShareableResult;