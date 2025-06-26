import { useFormLoading, useSetFieldValue } from "@/components/form/index";
import { Button, type ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps {
  name?: string;
  value?: any;
  children: React.ReactNode;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  loading?: boolean;
  className?: string;
  form?: string;
}

function Submit({
  name,
  value,
  children,
  size,
  variant,
  loading,
  className,
  form,
}: SubmitButtonProps) {
  const setFieldValue = useSetFieldValue();
  const formLoading = useFormLoading();
  function handleOnClick() {
    if (name) {
      setFieldValue(name, value);
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      name={name}
      defaultValue={value}
      type="submit"
      className={`text-nowrap ${className}`}
      loading={loading || formLoading}
      form={form}
      onClick={handleOnClick}
    >
      {children}
    </Button>
  );
}

export default Submit;
