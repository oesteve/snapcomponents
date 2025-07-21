import React from "react";

const Loading: React.FC = () => {
    return (
        <div className="flex items-center space-x-1 text-muted-foreground">
            <div className="animate-bounce delay-0 h-2 w-2 rounded-full bg-current"></div>
            <div className="animate-bounce delay-150 h-2 w-2 rounded-full bg-current"></div>
            <div className="animate-bounce delay-300 h-2 w-2 rounded-full bg-current"></div>
        </div>
    );
};

export default Loading;
