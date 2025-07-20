import React from "react";

export interface LabelValueRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const LabelValueRow: React.FC<LabelValueRowProps> = ({ label, value, className }) => (
  <p className={className}>
    <strong>{label}</strong> <span className="opacity-60">{value}</span>
  </p>
); 