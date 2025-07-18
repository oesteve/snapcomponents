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
import React, { type ComponentProps, type FC, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface TextInputWidgetProps extends FormElementProps {
    type?: "email" | "text" | "url" | "https" | "number" | "password" | "tel";
    label?: string;
    description?: string;
    required?: boolean;
    icon?: FC<ComponentProps<"svg">>;
    placeholder?: string;
    containerClassName?: string;
}

export default function TextInputWidget({
    name,
    type,
    label,
    required,
    placeholder,
    disabled,
    description,
    className,
    containerClassName,
}: TextInputWidgetProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const setFieldValue = useSetFieldValue();
    const fieldErrors = useFieldErrors(name);
    const defaultFieldData = useDefaultFieldData(name);
    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        let value: string | object | null = event.target.value;

        if (value === "") {
            value = null;
        }

        setFieldValue(name, value);
    }

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        inputRef.current.value = defaultFieldData ?? "";
    }, [defaultFieldData]);

    return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
            {label ? <Label htmlFor={name}>{label}</Label> : null}
            {description && <FormDescription>{description}</FormDescription>}
            <Input
                ref={inputRef}
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={handleOnChange}
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
