import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, ImageIcon, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const TextInput = ({ onAnalyze, isLoading }: TextInputProps) => {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "image">("text");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setInputMode("image");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setInputMode("text");
  };

  const handleSubmit = () => {
    if (text.trim() || uploadedImage) {
      onAnalyze(text.trim());
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setInputMode("text")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300",
            inputMode === "text"
              ? "bg-card shadow-md text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Paste Text
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setInputMode("image")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300",
            inputMode === "image"
              ? "bg-card shadow-md text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ImageIcon className="w-4 h-4" />
          Upload Screenshot
        </motion.button>
      </div>

      {/* Text Input Mode */}
      <AnimatePresence mode="wait">
        {inputMode === "text" && (
          <motion.div 
            key="text-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the message here..."
              className="min-h-40 text-lg resize-none bg-card border-2 border-border focus:border-primary rounded-2xl p-4 placeholder:text-muted-foreground/60 transition-all duration-300"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-3 right-3 text-sm text-muted-foreground"
            >
              {text.length} characters
            </motion.div>
          </motion.div>
        )}

        {/* Image Upload Mode */}
        {inputMode === "image" && (
          <motion.div
            key="image-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative min-h-50 border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
              uploadedImage && "border-solid border-primary"
            )}
          >
            <AnimatePresence mode="wait">
              {uploadedImage ? (
                <motion.div 
                  key="uploaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={uploadedImage}
                    alt="Uploaded screenshot"
                    className="w-full h-auto max-h-75 object-contain rounded-xl"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                  <div className="absolute bottom-2 left-2 px-3 py-1 bg-background/80 backdrop-blur rounded-full text-sm">
                    Screenshot ready
                  </div>
                </motion.div>
              ) : (
                <motion.label 
                  key="upload-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-50 cursor-pointer p-6"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4"
                  >
                    <Upload className="w-8 h-8 text-primary-foreground" />
                  </motion.div>
                  <p className="text-lg font-medium text-center">
                    Drop your screenshot here
                  </p>
                  <p className="text-muted-foreground mt-1">
                    or tap to upload from camera roll
                  </p>
                </motion.label>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handleSubmit}
          disabled={(!text.trim() && !uploadedImage) || isLoading}
          className={cn(
            "w-full h-14 text-lg font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" 
              />
              Analyzing vibes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Check the Vibe
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TextInput;