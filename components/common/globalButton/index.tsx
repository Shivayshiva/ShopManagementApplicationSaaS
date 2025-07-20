import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GLOBAL_BUTTON_PROPS } from "@/interface/globalButton.interface";
import { Loader2 } from "lucide-react";

const GlobalButton: React.FC<GLOBAL_BUTTON_PROPS> = ({
  text,
  onClick,
  variant = "default",
  size = "default",
  className = "bg-black text-white",
  disabled = false,
  icon,
  iconPosition = "left",
  type = "button",
  loading = false,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      type={type}
      className={cn("flex items-center gap-2 ", className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {iconPosition === "left" && icon}
          {text}
          {iconPosition === "right" && icon}
        </>
      )}
    </Button>
  );
};

export default GlobalButton;
