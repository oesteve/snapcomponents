import { Label } from "@/components/ui/label.tsx";
import { FormDescription } from "@/components/form/form-description.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table.tsx";
import { EditIntentDialog } from "@/admin/components/agents/chat/edit-intent-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus, Trash2 } from "lucide-react";
import {
    type FormElementProps,
    useFieldData,
    useSetFieldValue,
} from "@/components/form";
import type { ChatIntent } from "@/lib/agents/chat.ts";
import { useState } from "react";

export function IntentsWidget(props: FormElementProps) {
    const [toEdit, setToEdit] = useState<string>();
    const intents: ChatIntent[] = useFieldData<ChatIntent[]>(props.name);
    const setFieldValue = useSetFieldValue();

    function handleAdd(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        e.stopPropagation();

        setToEdit(`${props.name}[${intents.length}]`);
    }

    function handleRemove(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        idx,
    ) {
        e.preventDefault();
        e.stopPropagation();
        setFieldValue(`${props.name}[${idx}]`, undefined);
    }

    function handleEdit(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        toEdit: string,
    ) {
        e.preventDefault();
        e.stopPropagation();
        setToEdit(toEdit);
    }

    return (
        <div className="space-y-2">
            <Label>{props.label}</Label>
            <FormDescription>{props.description}</FormDescription>
            <div>
                <Table>
                    <TableBody>
                        {intents.map((intentData, idx) => (
                            <TableRow>
                                <TableCell>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={(e) =>
                                            handleEdit(
                                                e,
                                                `${props.name}[${idx}]`,
                                            )
                                        }
                                    >
                                        {intentData.name}
                                    </Button>
                                </TableCell>
                                <TableCell>{intentData.description}</TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={(e) => handleRemove(e, idx)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-center space-x-2 pt-4">
                    <Button variant="secondary" onClick={handleAdd}>
                        <Plus />
                        Add Intent
                    </Button>
                </div>
            </div>
            {toEdit && (
                <EditIntentDialog
                    name={toEdit}
                    onClosed={() => setToEdit(undefined)}
                />
            )}
        </div>
    );
}
