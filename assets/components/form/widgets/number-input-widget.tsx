"use client";

import {
  type FormElementProps,
  useDefaultFieldData,
  useFieldErrors,
  useSetFieldValue,
} from "@/components/form";
import { FormDescription } from "@/components/form/form-description";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { type ComponentProps, type FC, useRef } from "react";

import { cn } from "@/lib/utils/cn.ts";

export interface NumberInputWidgetProps extends FormElementProps {
  label?: string;
  description?: string;
  required?: boolean;
  icon?: FC<ComponentProps<"svg">>;
  placeholder?: string;
  containerClassName?: string;
}

export default function NumberInputWidget({
  name,
  label,
  required,
  placeholder,
  disabled,
  description,
  className,
  containerClassName,
}: NumberInputWidgetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const setFieldValue = useSetFieldValue();
  const fieldErrors = useFieldErrors(name);
  const defaultFieldData = useDefaultFieldData(name);
  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value: string | object | null = event.target.value;

    if (value === "") {
      value = null;
    }

    setFieldValue(name, value && parseInt(value));
  }

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      {description && <FormDescription>{description}</FormDescription>}
      <Input
        ref={inputRef}
        name={name}
        type="number"
        placeholder={placeholder}
        onChange={handleOnChange}
        required={required}
        disabled={disabled}
        defaultValue={defaultFieldData}
        color={fieldErrors.length ? "failure" : undefined}
        className={cn("w-full", className)}
      />
      {fieldErrors.map((error, index) => (
        <div key={index} className="mb-2 text-sm text-destructive">
          {error}
        </div>
      ))}
    </div>
  );
}
