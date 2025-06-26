import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import React, {useState} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Minus, Plus} from "lucide-react";

interface SimpleCounterProps {
    initialValue?: number;
}

const SimpleCounter: React.FC<SimpleCounterProps> = ({initialValue = 0}) => {
    const [count, setCount] = useState(initialValue);

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
                    <Minus/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCount(count + 1)}
                >
                    <Plus/>
                </Button>
            </CardContent>
        </Card>
    );
};

export default SimpleCounter;
