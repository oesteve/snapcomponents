import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Minus, Plus, ShoppingCart} from "lucide-react";

interface CartIndicatorProps {
    initialValue?: number;
}

const CartIndicator: React.FC<CartIndicatorProps> = ({initialValue = 0}) => {
    const [count, setCount] = useState(initialValue);

    useEffect(() => {
        setCount(initialValue)
    }, [initialValue])

    return (
        <Card className="w-auto inline-block">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-center ml-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-medium rounded-full">
                        {count}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center gap-2 pt-2">
                <Button
                    onClick={() => setCount(prev => Math.max(0, prev - 1))}
                    size="icon"
                    variant="outline"
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCount(prev => prev + 1)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default CartIndicator;
