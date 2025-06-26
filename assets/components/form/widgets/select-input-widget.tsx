"use client";

import {
  type FormElementProps,
  useDefaultFieldData,
  useFieldErrors,
  useSetFieldValue,
} from "@/components/form";
import { FormDescription } from "@/components/form/form-description";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils/cn.ts";
import { useEffect, useState } from "react";

type SelectInputWidgetProps = FormElementProps & {
  options: Record<string, any>;
  nullable?: boolean;
  placeholder?: string;
  className?: string;
};

function labelFromValue(value: string | number, options: Record<string, any>) {
  const selectedOption = Object.entries(options).find(
    ([, optionValue]) => optionValue === value,
  );
  return selectedOption ? selectedOption[0] : "";
}

export default function SelectInputWidget({
  name,
  label,
  description,
  options,
  nullable,
  placeholder,
  className,
}: SelectInputWidgetProps) {
  const setFieldValue = useSetFieldValue();
  const fieldErrors = useFieldErrors(name);
  const defaultFieldData = useDefaultFieldData<number | undefined>(name);
  const [value, setValue] = useState(labelFromValue(defaultFieldData, options));

  useEffect(() => {
    setValue(labelFromValue(defaultFieldData, options));
  }, [defaultFieldData, name, options, setFieldValue]);

  function handleOnChange(key: string) {
    setValue(key);
    setFieldValue(name, options[key] ?? null);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      {description && <FormDescription>{description}</FormDescription>}
      <Select
        defaultValue={defaultFieldData}
        onValueChange={handleOnChange}
        value={value}
      >
        <SelectTrigger className="w-full mb-2">
          <SelectValue placeholder={placeholder ?? "Seleccione un elemento"} />
        </SelectTrigger>
        <SelectContent>
          {nullable && (
            <SelectItem value="null" className="text-muted-foreground">
              {placeholder ?? "Ningún elemento"}
            </SelectItem>
          )}
          {Object.keys(options).map((label) => (
            <SelectItem value={label} key={label}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldErrors.map((error, index) => (
        <div key={index} className="text-sm text-destructive">
          {error}
        </div>
      ))}
    </div>
  );
}
