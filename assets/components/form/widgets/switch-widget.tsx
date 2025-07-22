import {
    type FormElementProps,
    useDefaultFieldData,
    useFieldErrors,
    useSetFieldValue,
} from "@/components/form";
import { FormDescription } from "@/components/form/form-description";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface SwitchWidgetProps extends FormElementProps {
    label?: string;
    description?: string;
    required?: boolean;
    containerClassName?: string;
}

export default function SwitchWidget({
    name,
    label,
    required,
    disabled,
    description,
    className,
    containerClassName,
}: SwitchWidgetProps) {
    const setFieldValue = useSetFieldValue();
    const fieldErrors = useFieldErrors(name);
    const defaultFieldData = useDefaultFieldData<boolean>(name);

    const [checked, setChecked] = useState<boolean>(
        typeof defaultFieldData === "boolean" ? defaultFieldData : false,
    );

    function handleOnChange(value: boolean) {
        setChecked(value);
        setFieldValue(name, value);
    }

    useEffect(() => {
        if (typeof defaultFieldData === "boolean") {
            setChecked(defaultFieldData);
        }
    }, [defaultFieldData]);

    return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-2">
                    {label ? <Label htmlFor={name}>{label}</Label> : null}
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                </div>
                <Switch
                    id={name}
                    name={name}
                    checked={checked}
                    onCheckedChange={handleOnChange}
                    required={required}
                    disabled={disabled}
                    className={className}
                />
            </div>
            {fieldErrors.map((error, index) => (
                <div key={index} className="text-sm text-destructive">
                    {error}
                </div>
            ))}
        </div>
    );
}
