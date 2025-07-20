import React, { useRef, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface TooltipTextProps {
  text: string;
  width?: number; // in px
  className?: string;
  description?: string;
}

const TooltipText: React.FC<TooltipTextProps> = ({
  text,
  width = 120,
  className,
  description = "",
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const el = spanRef.current;
    if (el) {
      setIsOverflowed(el.scrollWidth > el.clientWidth);
    }
  }, [text, width]);

  const span = (
    <span
      ref={spanRef}
      className={`font-mono text-sm truncate inline-block align-middle cursor-pointer ${
        className ?? ""
      }`}
      style={{ maxWidth: width, width: width }}
      title={isOverflowed ? undefined : text}
    >
      {text}
    </span>
  );

  if (isOverflowed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{span}</TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex flex-col justify-center align-middle">
            <h4>{text}</h4>

            <p>{description && `Description:- ${description}`}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }
  return span;
};

export default TooltipText;
