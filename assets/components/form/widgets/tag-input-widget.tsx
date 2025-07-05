import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label.tsx";
import { FormDescription } from "@/components/form/form-description.tsx";
import { useEffect, useMemo, useState } from "react";
import {
    type FormElementProps,
    useDefaultFieldData,
    useFieldErrors,
    useSetFieldValue,
} from "@/components/form";
import { useCommandState } from "cmdk";
import { Plus, X } from "lucide-react";

export interface TagInputWidgetProps extends FormElementProps {
    type?: "email" | "text" | "url" | "https";
    required?: boolean;
    options: string[];
    placeholder?: string;
}

function AddTag({ onAdd }: { onAdd: (value: string) => void }) {
    const search = useCommandState((state) => state.search);
    if (!search) return null;

    return (
        <CommandEmpty>
            <Button variant="outline" onClick={() => onAdd(search)}>
                <Plus />
                {`Añadir tag '${search}'`}
            </Button>
        </CommandEmpty>
    );
}

export function TagInputWidget({
    label,
    name,
    description,
    ...props
}: TagInputWidgetProps) {
    const [open, setOpen] = useState(false);
    const setFieldValue = useSetFieldValue();
    const fieldErrors = useFieldErrors(name);
    const defaultFieldData = useDefaultFieldData<string[]>(name);

    const [value, setValue] = useState<string[]>(
        Array.isArray(defaultFieldData) ? defaultFieldData : [],
    );

    useEffect(() => {
        setFieldValue(name, value);
    }, [value, setFieldValue, name]);

    useEffect(() => {
        if (!Array.isArray(defaultFieldData)) {
            setValue([]);
            return;
        }

        setValue(defaultFieldData);
    }, [defaultFieldData]);

    function handleOnAdd(newValue: string) {
        setOpen(false);
        setValue([...value, newValue]);
    }

    function handleOnRemove(valueToRemove: string) {
        setValue(value.filter((value) => value !== valueToRemove));
    }

    const options = useMemo(() => {
        return props.options.filter((option) => !value.includes(option));
    }, [props.options, value]);

    return (
        <div className={cn("flex flex-col gap-2")}>
            {label ? <Label htmlFor={name}>{label}</Label> : null}
            {description && <FormDescription>{description}</FormDescription>}
            <div className="flex flex-wrap gap-2 items-center mb-2">
                {value.map((entry) => (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleOnRemove(entry);
                        }}
                    >
                        {entry}
                        <X />
                    </Button>
                ))}

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Añadir</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                        <Command>
                            <CommandInput placeholder={props.placeholder} />
                            <CommandList>
                                <AddTag onAdd={handleOnAdd} />
                                <CommandGroup>
                                    {options.map((value) => (
                                        <CommandItem
                                            key={value}
                                            onSelect={() => handleOnAdd(value)}
                                        >
                                            {value}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {fieldErrors.map((error, index) => (
                <div key={index} className="text-sm text-destructive">
                    {error}
                </div>
            ))}
        </div>
    );
}
