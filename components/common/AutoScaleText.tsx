import React, { useEffect, useRef, useState } from "react";

interface AutoScaleTextProps {
  text: string;
  maxFontSize?: number; // optional, so it doesn't blow up too big
  minFontSize?: number; // optional, so it doesn't shrink too tiny
  widthPercentage?: number;
  className?: string;
  parentId?: string;
  onMouseEnter?: () => void;
}

const AutoScaleText: React.FC<AutoScaleTextProps> = ({
  text,
  maxFontSize = 100,
  minFontSize = 12,
  widthPercentage = 100,
  className,
  parentId,
  onMouseEnter
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateFontSize = () => {
    const el = ref.current;
    if (!el) return;

    // Use parentId if given, otherwise fallback to natural parent
    let parent = parentId
      ? document.getElementById(parentId)
      : el.parentElement;
    if (!parent) return;
    
    // Get the overlay container (the actual visible area)
    const overlay = parent.querySelector('.overlay') as HTMLElement;
    if (!overlay) return;
    
    let overlayWidth = overlay.offsetWidth;
    let overlayHeight = overlay.offsetHeight;
    
    if (overlayWidth === 0 || overlayHeight === 0) return;

    // Set initial font size to max to measure natural size
    el.style.fontSize = `${maxFontSize}px`;
    
    // Get the text container that holds both text elements
    const textContainer = el.parentElement;
    if (!textContainer) return;
    
    // Calculate available space with generous padding
    const availableWidth = overlayWidth * 0.9; // 90% of overlay width
    const availableHeight = overlayHeight * 0.7; // 70% of overlay height (more conservative)
    
    // Measure the text container with both text elements
    const textContainerHeight = textContainer.scrollHeight;
    const textContainerWidth = textContainer.scrollWidth;
    
    // Calculate scale factors for both width and height
    const widthScale = availableWidth / textContainerWidth;
    const heightScale = availableHeight / textContainerHeight;
    
    // Use the smaller scale factor to ensure both dimensions fit
    const scaleFactor = Math.min(widthScale, heightScale, 1);
    
    let newSize = maxFontSize * scaleFactor;
    
    // Apply constraints - but prioritize fitting over max size
    if (newSize > maxFontSize) {
      newSize = maxFontSize;
    }
    if (newSize < minFontSize) {
      newSize = minFontSize;
    }
    
    // Set the calculated size and mark as calculated
    setFontSize(newSize);
    setIsCalculated(true);
  };

  const handleMouseEnter = () => {
    // Only calculate once when first hovered
    if (!isCalculated) {
      // Wait for the overlay transition to complete before calculating
      setTimeout(() => {
        calculateFontSize();
      }, 350); // Wait for the 0.3s transition + buffer
    }
    
    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  useEffect(() => {
    // Reset calculation state when text or parentId changes
    setIsCalculated(false);
  }, [text, parentId]);

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{
        fontSize: `${fontSize}px`,
        whiteSpace: "normal", // allow wrapping for very long text
        wordWrap: "break-word",
        overflowWrap: "break-word",
        width: "100%",
        textAlign: "center",
        lineHeight: "1.1",
        maxHeight: "50%", // Ensure it doesn't take more than half the container
        overflow: "hidden"
      }}
    >
      {text}
    </div>
  );
};

export default AutoScaleText;