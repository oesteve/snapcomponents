"use client";

import {
  type FormElementProps,
  useDefaultFieldData,
  useFieldErrors,
  useFieldValue,
  useSetFieldValue,
} from "@/components/form";
import { FormDescription } from "@/components/form/form-description";
import { Label } from "@/components/ui/label";
import { type ComponentProps, type FC, useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn.ts";
import { Switch } from "@/components/ui/switch.tsx";

export interface TextInputWidgetProps extends FormElementProps {
  type?: "email" | "text" | "url" | "https" | "number" | "password" | "tel";
  label?: string;
  description?: string;
  required?: boolean;
  icon?: FC<ComponentProps<"svg">>;
  placeholder?: string;
  containerClassName?: string;
}

export default function SwitchWidget({
  name,
  label,
  disabled,
  description,
  containerClassName,
  onChange,
}: TextInputWidgetProps) {
  const [value, setValue] = useState(false);

  const setFieldValue = useSetFieldValue();
  const fieldErrors = useFieldErrors(name);
  const defaultFieldData = useDefaultFieldData(name);
  const fieldValue = useFieldValue(name);

  useEffect(() => {
    setValue(defaultFieldData);
  }, [defaultFieldData]);

  useEffect(() => {
    setValue(fieldValue);
  }, [fieldValue]);

  function onCheckedChange(checked: boolean) {
    setValue(checked);
    setFieldValue(name, checked);
    onChange?.(checked);
  }

  return (
    <div className={cn("flex flex-col", containerClassName)}>
      <div className="flex justify-between items-center border rounded-xl p-4">
        <div>
          {label ? (
            <Label htmlFor={name} className="mb-2">
              {label}
            </Label>
          ) : null}
          {description && <FormDescription>{description}</FormDescription>}
        </div>
        <Switch
          name={name}
          id={name}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          checked={value}
          color={fieldErrors.length ? "failure" : undefined}
        />
      </div>
      {fieldErrors.map((error, index) => (
        <div key={index} className="mb-2 text-sm text-destructive">
          {error}
        </div>
      ))}
    </div>
  );
}
