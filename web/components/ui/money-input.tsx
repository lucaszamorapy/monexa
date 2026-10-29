"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export interface MoneyInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value?: number | null;
  onChange?: (value: number | null) => void;
}

const formatToBRL = (val: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, placeholder = "R$ 0,00", onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => {
      if (typeof value === "number" && !isNaN(value)) {
        return formatToBRL(value);
      }
      return "";
    });

    React.useEffect(() => {
      if (typeof value === "number" && !isNaN(value)) {
        setDisplayValue(formatToBRL(value));
      } else if (value === null || value === undefined) {
        setDisplayValue("");
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const digits = rawValue.replace(/\D/g, "");

      if (!digits) {
        setDisplayValue("");
        onChange?.(null);
        return;
      }

      const numericValue = Number(digits) / 100;
      setDisplayValue(formatToBRL(numericValue));
      onChange?.(numericValue);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={onBlur}
      />
    );
  }
);

MoneyInput.displayName = "MoneyInput";

