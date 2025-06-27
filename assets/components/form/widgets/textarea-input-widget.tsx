"use client";

import {
  type FormElementProps,
  useDefaultFieldData,
  useFieldErrors,
  useSetFieldValue,
} from "@/components/form";
import { FormDescription } from "@/components/form/form-description";
import { Label } from "@/components/ui/label";
import React, { type ComponentProps, type FC } from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea.tsx";

export interface TextInputWidgetProps extends FormElementProps {
  type?: "email" | "text" | "url" | "https";
  required?: boolean;
  icon?: FC<ComponentProps<"svg">>;
  placeholder?: string;
  containerClassName?: string;
}

export default function TextareaInputWidget({
  name,
  label,
  required,
  placeholder,
  disabled,
  description,
  className,
  containerClassName,
}: TextInputWidgetProps) {
  const setFieldValue = useSetFieldValue();
  const fieldErrors = useFieldErrors(name);
  const defaultFieldData = useDefaultFieldData(name);
  function handleOnChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let value: string | object | null = event.target.value;

    if (value === "") {
      value = null;
    }

    setFieldValue(name, value);
  }

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      {description && <FormDescription>{description}</FormDescription>}
      <Textarea
        name={name}
        onChange={handleOnChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        defaultValue={defaultFieldData}
        color={fieldErrors.length ? "failure" : undefined}
        className={cn("w-full", className)}
      />
      {fieldErrors.map((error, index) => (
        <div key={index} className="text-sm text-destructive">
          {error}
        </div>
      ))}
    </div>
  );
}
