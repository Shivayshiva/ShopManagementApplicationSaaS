import { Calendar } from "@/components/ui/calendar";
import { Controller } from "react-hook-form";
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function FormCalendar({ label, name, control, error }: any) {
  return (
    <div>
      <Label className="block mb-1 ">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const [open, setOpen] = React.useState(false);
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={
                    "w-full pl-3 text-left font-normal" +
                    (!field.value ? " text-muted-foreground" : "")
                  }
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={date => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {error && (
        <p className="text-red-500 text-xs mt-3">{error}</p>
      )}
    </div>
  );
} 