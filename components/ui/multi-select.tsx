"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Badge } from "../../components/ui/badge";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  creatable?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items",
  creatable = true,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const allOptions = React.useMemo(() => {
    const merged = [...options];
    value.forEach((v) => {
      if (!merged.includes(v)) merged.push(v);
    });
    return merged;
  }, [options, value]);

  const handleSelect = (item: string) => {
    const newValue = value.includes(item)
      ? value.filter((v) => v !== item)
      : [...value, item];
    onChange(newValue);
  };

  const handleCreate = () => {
    if (!creatable) return;
    const newItem = inputValue.trim();
    if (newItem && !value.includes(newItem)) {
      onChange([...value, newItem]);
      setInputValue("");
    }
  };

  const handleRemove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation(); // منع انتشار الحدث
    onChange(value.filter((v) => v !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-50 hover:bg-gray-200 cursor-pointer"
        >
          <span className="truncate">
            {value.length === 0
              ? placeholder
              : `${value.length} selected`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search or type new..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <CommandEmpty>
            {creatable && inputValue ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4" /> Add "{inputValue}"
              </Button>
            ) : (
              "No items found."
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-48 overflow-y-auto">
            {allOptions.map((opt) => (
              <CommandItem
              className="hover:bg-gray-100 cursor-pointer"
                key={opt}
                value={opt}
                onSelect={() => handleSelect(opt)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(opt) ? "opacity-100" : "opacity-0"
                  )}
                />
                {opt}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
      <div className="flex flex-wrap gap-1 mt-2">
        {value.map((val) => (
          <Badge key={val} variant="secondary" className="gap-1">
            {val}
            <button
              type="button"
              onClick={(e) => handleRemove(val, e)}
              className="ml-1 rounded-full hover:bg-gray-200 p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </Popover>
  );
}