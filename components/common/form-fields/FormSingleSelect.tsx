import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Controller } from "react-hook-form";
import React from "react";

export function FormSingleSelect({ label, name, options, control, placeholder = "Select an option", error }: any) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option: any) => {
                if (typeof option === "string") {
                  return (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  );
                }
                return (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-red-500 text-xs mt-3">{error}</p>
      )}
    </div>
  );
} 