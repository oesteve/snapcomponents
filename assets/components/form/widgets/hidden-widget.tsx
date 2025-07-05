import { useSetFieldValue } from "@/components/form";
import { useEffect } from "react";

type HiddenWidgetProps = {
    name: string;
    value: any;
};

export function HiddenWidget({ name, value }: HiddenWidgetProps) {
    const setFieldValue = useSetFieldValue();

    useEffect(() => {
        setFieldValue(name, value);
    }, [name, value, setFieldValue]);

    return null;
}
