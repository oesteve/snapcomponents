import { useFieldErrors } from "@/components/form/index";

interface FieldErrorProps {
    name: string;
}
export default function FieldError(props: FieldErrorProps) {
    const errors = useFieldErrors(props.name);

    if (!errors.length) {
        return null;
    }

    return (
        <div className={`my-1 text-sm text-red-500`}>
            {errors.map((error) => (
                <p key={error}>{error}</p>
            ))}
        </div>
    );
}
