import { useRef, useState, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

export default function OTPInput({ 
  length, 
  value, 
  onChange, 
  onComplete,
  disabled = false 
}: OTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Auto-submit when all digits are entered
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (index: number, digit: string) => {
    // Only allow single digit
    const newDigit = digit.slice(-1);
    
    // Only allow numbers
    if (newDigit && !/^\d$/.test(newDigit)) {
      return;
    }

    const newValue = value.split("");
    newValue[index] = newDigit;
    const newOTP = newValue.join("");
    
    onChange(newOTP);

    // Move to next input if digit was entered
    if (newDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      
      const newValue = value.split("");
      
      if (newValue[index]) {
        // Clear current digit
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        // Move to previous and clear
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
        newValue[index - 1] = "";
        onChange(newValue.join(""));
      }
    }
    
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
    
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    
    // Only allow numeric paste
    if (!/^\d+$/.test(pasteData)) {
      return;
    }
    
    onChange(pasteData);
    
    // Focus last filled input
    const nextIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    setActiveIndex(nextIndex);
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold rounded-xl border-2 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
            activeIndex === index && !disabled
              ? "border-violet-500 shadow-lg shadow-violet-200"
              : "border-gray-300",
            value[index] ? "bg-violet-50 border-violet-400" : "bg-white",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}
