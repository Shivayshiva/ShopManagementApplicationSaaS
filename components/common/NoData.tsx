import React from "react";

export function NoData({ message = "No data found.", icon, className = "" }: { message?: string; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={`text-center py-8 ${className}`}>
      {icon && <div className="flex justify-center mb-2">{icon}</div>}
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export default NoData; 