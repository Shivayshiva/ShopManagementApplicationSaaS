import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Controller } from "react-hook-form";
import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FormMultiSelect({ label, name, options, control, placeholder = "Select options", error }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="block mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {field.value && field.value.length > 0
                    ? `${field.value.length} selected`
                    : placeholder}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {options?.map((option: string) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={field.value?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, option]);
                      } else {
                        field.onChange(currentValue.filter((item: string) => item !== option));
                      }
                    }}
                  >
                    {option}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Display selected items as badges */}
            {field.value && field.value.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {field.value.map((item: string) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const newValue = field.value.filter((val: string) => val !== item);
                        field.onChange(newValue);
                      }}
                    />
                  </Badge>
                ))}
              </div>
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