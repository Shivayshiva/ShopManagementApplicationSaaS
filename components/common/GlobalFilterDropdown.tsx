import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface GlobalFilterDropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  allLabel?: string; // e.g. 'All Categories'
}

const GlobalFilterDropdown: React.FC<GlobalFilterDropdownProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  className = '',
  allLabel = 'All',
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`min-w-[120px] justify-between ${className}`}>
          <Filter className="h-4 w-4 mr-1" />
          {label}
          <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={
              selectedOptions.includes(option) ||
              (option === 'all' && (selectedOptions.length === 0 || selectedOptions.includes('all')))
            }
            onCheckedChange={(checked) => {
              if (option === 'all') {
                onChange(checked ? ['all'] : []);
              } else {
                let newSelected = selectedOptions.filter((c) => c !== 'all');
                if (checked) {
                  newSelected = [...newSelected, option];
                } else {
                  newSelected = newSelected.filter((c) => c !== option);
                }
                onChange(newSelected);
              }
            }}
          >
            {option === 'all' ? allLabel : option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GlobalFilterDropdown; 