import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function FormTextInput({ label, name, control, error, type = "text", ...props }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <label className="block mb-1 ">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Input
              {...field}
              {...props}
              type={isPassword ? (showPassword ? "text" : "password") : type}
            />
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        )}
      />
      {error && (
        <p className="text-red-500 text-xs mt-3">{error}</p>
      )}
    </div>
  );
} 