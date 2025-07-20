"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "react",
    label: "React",
  },
  {
    value: "vue",
    label: "Vue.js",
  },
  {
    value: "angular",
    label: "Angular",
  },
]

export default function InputSelectTextInputField() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-col space-y-4 p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Framework</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between bg-transparent"
            >
              {value ? frameworks.find((framework) => framework.value === value)?.label : "Search frameworks..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Type to search frameworks..." className="px-4 py-2" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === framework.value ? "opacity-100" : "opacity-0")} />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {value && (
        <div className="rounded-md border p-3 bg-muted/50">
          <p className="text-sm text-muted-foreground">Selected value:</p>
          <p className="font-medium">{value}</p>
        </div>
      )}
    </div>
  )
}
