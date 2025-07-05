"use client";

import {
    type FormElementProps,
    useFieldErrors,
    useFieldValue,
} from "@/components/form";
import { FormDescription } from "@/components/form/form-description";
import { Label } from "@/components/ui/label";
import { type ComponentProps, type FC } from "react";

import { cn } from "@/lib/utils";
import TextareaInputWidget from "@/components/form/widgets/textarea-input-widget.tsx";
export interface DimensionWidgetProps extends FormElementProps {
    type?: "email" | "text" | "url" | "https";
    required?: boolean;
    icon?: FC<ComponentProps<"svg">>;
    placeholder?: string;
    dimensionLevels: string[];
}

export default function DimensionWidget({
    name,
    label,
    description,
    dimensionLevels,
    required,
}: DimensionWidgetProps) {
    const fieldValue = useFieldValue(name);
    const fieldErrors = useFieldErrors(name);

    console.log(fieldValue);

    return (
        <div className={cn("flex flex-col gap-2")}>
            {label ? (
                <Label htmlFor={name} className="mb-4">
                    {label}
                </Label>
            ) : null}
            {description && <FormDescription>{description}</FormDescription>}
            {dimensionLevels.map((level, index) => (
                <TextareaInputWidget
                    label={`${index + 1} ${level}`}
                    name={`${name}[${index}]`}
                    containerClassName="ms-4 mb-2"
                    required={required}
                />
            ))}
            {fieldErrors.map((error, index) => (
                <div key={index} className="mb-1 text-sm text-destructive">
                    {error}
                </div>
            ))}
        </div>
    );
}
