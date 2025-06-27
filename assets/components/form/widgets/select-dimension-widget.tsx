import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BadgeCheck, ChevronsUpDown } from "lucide-react";
import {
  useDefaultFieldData,
  useFieldData,
  useSetFieldValue,
} from "@/components/form";

type SelectDimensionWidgetProps = {
  description: string;
  dimensions: string[];
  name: string;
  onChange?: (value: number | null) => void;
};

const labels = [
  "Iniciado",
  "Repetible",
  "Definido",
  "Gestionado",
  "Optimizado",
];

export function SelectDimensionWidget(props: SelectDimensionWidgetProps) {
  const [open, setOpen] = useState(false);
  const setFieldValue = useSetFieldValue();
  const fieldValue = useFieldData<number>(props.name);
  const defaultFieldData = useDefaultFieldData(props.name);
  const [selected, setSelected] = useState<number | null>(
    defaultFieldData ?? null,
  );
  function handleOnClick(index: number) {
    if (selected === index) {
      setSelected(null);
      return;
    }

    setSelected(index);
  }

  function handleSelect() {
    setFieldValue(props.name, selected);
    props.onChange?.(selected);
    setOpen(false);
  }

  const label = useMemo(() => {
    if (fieldValue === null || fieldValue === undefined) {
      return "No Definido";
    }

    return labels[fieldValue];
  }, [fieldValue]);

  useEffect(() => {
    setSelected(fieldValue);
  }, [fieldValue, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full",
            !Number.isInteger(fieldValue) && "text-muted-foreground text-sm",
          )}
        >
          {label}
          <ChevronsUpDown className="absolute right-2 top-2.5 text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Seleccione un nivel de madurez</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <div className="ps-1 pe-2 grid gap-2 overflow-y-scroll">
          {props.dimensions.map((dimension, key) => (
            <button
              className={cn(
                "text-sm border rounded-xl shadow p-4 text-start flex flex-row gap-4 hover:bg-secondary transition-colors justify-between",
                selected === key && "border-primary",
              )}
              key={key}
              onClick={() => handleOnClick(key)}
            >
              <div>
                <label className="font-medium leading-none">
                  {labels[key]}
                </label>
                <p className="text-muted-foreground text-sm">{dimension}</p>
              </div>
              <div className="flex items-center text-primary w-10 justify-center">
                {selected === key && <BadgeCheck />}
              </div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSelect}>Selecionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
