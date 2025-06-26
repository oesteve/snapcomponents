import { useFormError } from "@/components/form/index";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FormError() {
  const error = useFormError();

  if (!error) {
    return null;
  }

  return (
    <Alert variant="destructive" className="my-2 overflow-y-scroll">
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
