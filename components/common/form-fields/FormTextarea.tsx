import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import React from "react";

export function FormTextarea({ label, name, control, error, ...props }: any) {
  return (
    <div>
      <label className="block mb-1 ">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Textarea {...field} {...props} />}
      />
      {error && (
        <p className="text-red-500 text-xs mt-3">{error}</p>
      )}
    </div>
  );
} 