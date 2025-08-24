import React, { useEffect, useRef, useState } from "react";

interface AutoScaleTextProps {
  text: string;
  maxFontSize?: number; // optional, so it doesn't blow up too big
  minFontSize?: number; // optional, so it doesn't shrink too tiny
  widthPercentage?: number;
  className?: string;
  parentId?: string;
}

const AutoScaleText: React.FC<AutoScaleTextProps> = ({
  text,
  maxFontSize = 100,
  minFontSize = 12,
  widthPercentage = 100,
  className,
  parentId
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    console.log("-------------------")
    console.log(`Parent ID: ${parentId}`)
    console.log(`Text: ${text}`)

    parentId = null;

    // Use parentId if given, otherwise fallback to natural parent
    let parent = parentId
      ? document.getElementById(parentId)
      : el.parentElement;
    if (!parent) 
        {
            console.log("Couldn't find parent")
            return;
        }
    let parentWidth = parent.offsetWidth;

    console.log(`${parentId} width:   ${parentWidth}`);
    if (parentWidth === 0) 
        {
            return;
        }

    // Reset font size to max, measure, then shrink if needed
    //el.style.fontSize = `${maxFontSize}px`;
    const naturalWidth = el.scrollWidth;

    let newSize = maxFontSize * (parentWidth / naturalWidth) * (widthPercentage / 100);
    if (newSize > maxFontSize)
        {
            console.log("setting to max font size")
          newSize = maxFontSize;  
        } 
    if (newSize < minFontSize){
            console.log("setting to min font size")
          newSize = minFontSize;  
        } 
    console.log(`Setting new size: ${newSize}pt font`)
    setFontSize(newSize);
    console.log("-------------------")
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [text, parentId]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        fontSize: `${fontSize}px`,
        whiteSpace: "nowrap", // keep one line
        width: "100%",
        textAlign: "center"
      }}
    >
      {text}
    </div>
  );
};

export default AutoScaleText;