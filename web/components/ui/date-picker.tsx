"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export interface DatePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
}

const parseToDate = (
  val: Date | string | null | undefined,
): Date | undefined => {
  if (!val) return undefined;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? undefined : val;
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    // Format YYYY-MM-DD or ISO string
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const [year, month, day] = trimmed.slice(0, 10).split("-").map(Number);
      return new Date(year, month - 1, day, 12, 0, 0);
    }
    // Format dd/MM/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}/.test(trimmed)) {
      const [day, month, year] = trimmed.slice(0, 10).split("/").map(Number);
      return new Date(year, month - 1, day, 12, 0, 0);
    }
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "dd/mm/aaaa",
      disabled = false,
      className,
      id,
      "aria-invalid": ariaInvalid,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const initialDate = React.useMemo(() => parseToDate(value), [value]);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
      initialDate,
    );
    const [inputValue, setInputValue] = React.useState<string>(() =>
      initialDate ? format(initialDate, "dd/MM/yyyy") : "",
    );

    React.useEffect(() => {
      const parsed = parseToDate(value);
      setSelectedDate(parsed);
      setInputValue(parsed ? format(parsed, "dd/MM/yyyy") : "");
    }, [value]);

    const handleSelectDate = (date: Date | undefined) => {
      setSelectedDate(date);
      if (date) {
        setInputValue(format(date, "dd/MM/yyyy"));
        onChange?.(date);
      } else {
        setInputValue("");
        onChange?.(undefined);
      }
      setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, "").slice(0, 8);

      let formatted = "";
      if (digits.length <= 2) {
        formatted = digits;
      } else if (digits.length <= 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
      }

      setInputValue(formatted);

      if (digits.length === 8) {
        const day = Number(digits.slice(0, 2));
        const month = Number(digits.slice(2, 4));
        const year = Number(digits.slice(4, 8));
        const parsed = new Date(year, month - 1, day, 12, 0, 0);

        if (
          !isNaN(parsed.getTime()) &&
          parsed.getFullYear() === year &&
          parsed.getMonth() === month - 1 &&
          parsed.getDate() === day
        ) {
          setSelectedDate(parsed);
          onChange?.(parsed);
        }
      } else if (digits.length === 0) {
        setSelectedDate(undefined);
        onChange?.(undefined);
      }
    };

    return (
      <InputGroup className={className}>
        <InputGroupInput
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          aria-invalid={ariaInvalid}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                type="button"
                size="icon-xs"
                variant="ghost"
                disabled={disabled}
                aria-label="Selecionar data"
                title="Selecionar data"
              >
                <CalendarIcon className="size-3.5" />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    );
  },
);

DatePicker.displayName = "DatePicker";
