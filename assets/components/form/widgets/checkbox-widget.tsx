"use client";

import {
    type FormElementProps,
    useDefaultFieldData,
    useFieldErrors,
    useSetFieldValue,
} from "@/components/form";
import { FormDescription } from "@/components/form/form-description";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

type SelectInputWidgetProps = FormElementProps & {
    type?: "string" | "number";
    options: Record<string, any>;
};

export default function CheckboxWidget({
    name,
    label,
    description,
    options,
    type = "string",
}: SelectInputWidgetProps) {
    const setFieldValue = useSetFieldValue();
    const fieldErrors = useFieldErrors(name);
    const defaultFieldData = useDefaultFieldData(name);

    const parseValue = useCallback(
        (value: any): any => {
            if (type === "number") {
                return parseInt(value, 10);
            }
            return value;
        },
        [type],
    );

    const [values, setValues] = useState(
        Array.isArray(defaultFieldData) ? defaultFieldData.map(parseValue) : [],
    );

    useEffect(() => {
        setValues(
            Array.isArray(defaultFieldData)
                ? defaultFieldData.map(parseValue)
                : [],
        );
    }, [defaultFieldData, name, parseValue]);

    useEffect(() => {
        setFieldValue(name, values);
    }, [setFieldValue, name, values]);

    function handleOnCheck(value: string, checked: boolean) {
        const parsedValue = parseValue(value);
        if (checked && !values.includes(parsedValue)) {
            setValues([...values, parsedValue]);
        } else {
            setValues(values.filter((v) => v !== parsedValue));
        }
    }

    return (
        <div className={cn("flex flex-col gap-2")}>
            {label ? <Label htmlFor={name}>{label}</Label> : null}
            {description && <FormDescription>{description}</FormDescription>}
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(options).map(([value, label]) => {
                    const parsedValue = parseValue(value);
                    return (
                        <div
                            className="flex flex-row items-center gap-2"
                            key={value}
                        >
                            <Checkbox
                                value={value}
                                id={value}
                                onCheckedChange={(checked) =>
                                    handleOnCheck(value, checked === true)
                                }
                                checked={values.includes(parsedValue)}
                            />
                            <Label htmlFor={value}>{label}</Label>
                        </div>
                    );
                })}
            </div>
            {fieldErrors.map((error, index) => (
                <div key={index} className="text-sm text-destructive">
                    {error}
                </div>
            ))}
        </div>
    );
}
