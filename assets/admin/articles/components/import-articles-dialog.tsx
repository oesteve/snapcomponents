import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
    importArticlesFromCsv,
    type ImportResult,
} from "@/admin/articles/lib/articles.ts";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { FormDescription } from "@/components/form/form-description.tsx";

interface ImportArticlesDialogProps {
    onImported: () => void;
}

export function ImportArticlesDialog({
    onImported,
}: ImportArticlesDialogProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const importArticlesMutation = useMutation({
        mutationFn: (file: File) => importArticlesFromCsv(file),
        onSuccess: (result) => {
            setImportResult(result);
            // Call onImported if any articles were successfully imported
            if (result.articles.length > 0) {
                onImported();
            }

            // Don't close the dialog immediately as we're showing results in tables
            // Only close if there are no results to show
            if (result.articles.length === 0 && result.errors.length === 0) {
                setOpen(false);
            }
        },
        onError: (error) => {
            toast.error(
                `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        setImportResult(null);
    };

    const handleImport = () => {
        if (file) {
            importArticlesMutation.mutate(file);
        } else {
            toast.error("Please select a file to import");
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            // Reset state when dialog is closed
            setFile(null);
            setImportResult(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
        setOpen(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Import Articles from CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to import multiple articles at once.
                        The CSV file should have the following columns: name,
                        title, description, content.
                        <Button variant="link" asChild className="py-0">
                            <a href="/articles.csv" download>
                                Download example CSV file
                            </a>
                        </Button>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    {importResult ? (
                        <div className="space-y-12">
                            {importResult.articles.length > 0 && (
                                <>
                                    <Alert>
                                        <CheckCircle2 />
                                        <AlertTitle>
                                            Successfully imported{" "}
                                            {importResult.success} articles
                                        </AlertTitle>
                                        <AlertDescription>
                                            The articles have been added to your
                                            database.
                                        </AlertDescription>
                                    </Alert>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>
                                                    Description
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {importResult.articles.map(
                                                (article) => (
                                                    <TableRow key={article.id}>
                                                        <TableCell className="font-medium">
                                                            {article.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {article.title}
                                                        </TableCell>
                                                        <TableCell className="truncate max-w-[200px]">
                                                            {
                                                                article.description
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            )}

                            {importResult.errors.length > 0 && (
                                <div className="space-y-2">
                                    <Alert variant="destructive">
                                        <AlertCircle />
                                        <AlertTitle>
                                            Failed to import{" "}
                                            {importResult.errors.length}{" "}
                                            articles
                                        </AlertTitle>
                                        <AlertDescription>
                                            <p>
                                                Please check the errors below
                                                and try again.
                                            </p>
                                            <ul className="list-inside list-disc text-sm">
                                                <li>Verify CSV format</li>
                                                <li>Check required columns</li>
                                                <li>Ensure data is valid</li>
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Line</TableHead>
                                                <TableHead>Error</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {importResult.errors.map(
                                                (error, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">
                                                            {error.line}
                                                        </TableCell>
                                                        <TableCell>
                                                            {error.message}
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            <Button
                                onClick={() => {
                                    setImportResult(null);
                                    setFile(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                            >
                                Import Another File
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="csv-file">CSV File</Label>
                                <Input
                                    ref={fileInputRef}
                                    id="csv-file"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                                <FormDescription>
                                    Only CSV files are accepted.
                                </FormDescription>
                            </div>

                            <Button
                                className="mt-4"
                                onClick={handleImport}
                                disabled={
                                    !file || importArticlesMutation.isPending
                                }
                            >
                                {importArticlesMutation.isPending
                                    ? "Importing..."
                                    : "Import Articles"}
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
