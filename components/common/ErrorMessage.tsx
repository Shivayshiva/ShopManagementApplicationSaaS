import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  icon = <AlertCircle className="h-6 w-6" />, // default icon
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 text-red-600 ${className}`}>
      {icon}
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage; 