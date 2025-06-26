import React from "react";

interface CodeBlockProps {
  data?: any;
  color?: "red";
  children?: React.ReactNode;
}

export default function CodeBlock({ data, color, children }: CodeBlockProps) {
  const borderClas = color === "red" ? "border-red-300" : "border";

  return (
    <div
      className={`my-3 inline-grid w-full rounded-lg border bg-secondary p-2 text-sm ${borderClas}`}
    >
      <pre className="overflow-x-auto text-start">
        {data && JSON.stringify(data, null, 2)}
        {children}
      </pre>
    </div>
  );
}
