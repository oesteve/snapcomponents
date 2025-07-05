import CodeBlock from "@/components/form/code-block";
import { useFormData, useFormError } from "@/components/form/index";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function DataBlock() {
    const formData = useFormData();
    return <CodeBlock data={formData} />;
}

function ErrorBlock() {
    const error = useFormError();
    return <CodeBlock data={error} color="red" />;
}

function FormData() {
    const error = useFormError();
    const [dataExpanded, setDataExpanded] = useState(false);
    const [errorExpanded, setErrorExpanded] = useState(false);

    function handleErrorClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setErrorExpanded(!errorExpanded);
    }

    function handleDataClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setDataExpanded(!dataExpanded);
    }

    return (
        <div>
            <div className="flex flex-row gap-2">
                <Button
                    tabIndex={1}
                    size="sm"
                    className="inline-block"
                    color="gray"
                    variant="outline"
                    onClick={handleDataClick}
                >
                    {dataExpanded ? "Hidde" : "Show data"}
                </Button>

                {error ? (
                    <Button
                        size="sm"
                        className="inline-block border-destructive"
                        color="red"
                        variant="outline"
                        onClick={handleErrorClick}
                    >
                        {errorExpanded ? "Hide error" : "Show error"}
                    </Button>
                ) : null}
            </div>

            {dataExpanded && <DataBlock />}
            {errorExpanded && <ErrorBlock />}
        </div>
    );
}

export default function DevFormData() {
    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    return <FormData />;
}
