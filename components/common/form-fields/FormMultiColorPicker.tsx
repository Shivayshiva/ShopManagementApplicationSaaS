import React, { useRef, useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
// @ts-expect-error: No type definitions for 'react-color'
import { ChromePicker, ColorResult } from "react-color";

interface FormMultiColorPickerProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
  placeholder?: string;
}

export const FormMultiColorPicker: React.FC<FormMultiColorPickerProps> = ({
  name,
  control,
  label,
  error,
  placeholder = "Pick colors...",
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("#000000");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = [], onChange } = field;
        const handleAddColor = () => {
          if (!value.includes(currentColor)) {
            onChange([...value, currentColor]);
          }
          setDialogOpen(false);
        };
        const handleRemoveColor = (color: string) => {
          onChange(value.filter((c: string) => c !== color));
        };
        return (
          <div className="flex flex-col gap-2">
            {label && <Label className="font-medium">{label}</Label>}
            <div className="flex flex-wrap gap-2 items-center">
            
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-10 w-fit mt-2 p-0 bg-black text-white px-8"
                    aria-label="Add color"
                  >
                    Select Colors
                  </Button>
                </DialogTrigger>
                <DialogContent className=" w-full max-h-[95vh] flex flex-col items-center gap-4">
                  <DialogTitle>Pick a color</DialogTitle>
                  {/* Large preview of the currently picked color */}
                  <div
                    className="w-[95%] h-32 rounded-full border mb-2"
                    style={{ backgroundColor: currentColor }}
                    title={currentColor}
                  />
                  <div className="color-picker-wrapper w-full">
                    <ChromePicker
                      color={currentColor}
                      onChange={(color: ColorResult) =>
                        setCurrentColor(color.hex)
                      }
                      disableAlpha
                      //   className="w-[60%] h-auto"
                    />
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    className="mt-4 w-32"
                    onClick={handleAddColor}
                  >
                    Add
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-row flex-wrap">
            {value.map((color: string, idx: number) => (
                <Badge
                  key={color + idx}
                  className="flex items-center gap-1 px-2 py-1"
                  variant="outline"
                >
                  <span
                    className="w-8 h-8 rounded-full border mr-1"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-red-500 hover:bg-transparent hover:text-red-700"
                    onClick={() => handleRemoveColor(color)}
                    aria-label={`Remove color ${color}`}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
           
            {placeholder && value.length === 0 && (
              <span className="text-gray-400 text-xs">{placeholder}</span>
            )}
            {error && <span className="text-red-500 text-xs">{error}</span>}
          </div>
        );
      }}
    />
  );
};

export default FormMultiColorPicker;
