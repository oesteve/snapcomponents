import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Minus, Plus } from "lucide-react";

interface SimpleCounterProps {
    initialValue?: number;
}

const SimpleCounter: React.FC<SimpleCounterProps> = ({ initialValue = 0 }) => {
    const [count, setCount] = useState(initialValue);

    useEffect(() => {
        const increment = () => {
            setCount(count + 1);
        };

        document.addEventListener("add-to-cart", increment);

        return () => {
            document.removeEventListener("add-to-cart", increment);
        };
    }, []);

    return (
        <Card className="w-auto inline-block">
            <CardHeader>
                <CardTitle className="text-center">{count}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center gap-2 pt-4">
                <Button
                    onClick={() => setCount(count - 1)}
                    size="icon"
                    variant="outline"
                >
                    <Minus />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCount(count + 1)}
                >
                    <Plus />
                </Button>
            </CardContent>
        </Card>
    );
};

export default SimpleCounter;
