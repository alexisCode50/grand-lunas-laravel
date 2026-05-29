import { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type FieldType = 'text' | 'textarea' | 'image';

export interface FieldDef {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
}

interface ItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    fields: FieldDef[];
    initialValues?: Record<string, string>;
    onSubmit: (values: Record<string, string>) => void;
}

export function ItemDialog({
    open,
    onOpenChange,
    title,
    description,
    fields,
    initialValues,
    onSubmit,
}: ItemDialogProps) {
    const [values, setValues] = useState<Record<string, string>>({});
    const [dragField, setDragField] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const seed: Record<string, string> = {};
        fields.forEach((field) => {
            seed[field.name] = initialValues?.[field.name] ?? '';
        });
        setValues(seed);
    }, [fields, initialValues, open]);

    const readFile = (file: File, name: string) => {
        if (!file.type.startsWith('image/')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setValues((current) => ({ ...current, [name]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit(values);
                        onOpenChange(false);
                    }}
                    className="space-y-4"
                >
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name} className="text-sm font-medium">
                                {field.label}
                                {field.required ? <span className="ml-1 text-primary">*</span> : null}
                            </Label>
                            {field.type === 'textarea' ? (
                                <Textarea
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    value={values[field.name] ?? ''}
                                    onChange={(event) => {
                                        setValues((current) => ({ ...current, [field.name]: event.target.value }));
                                    }}
                                    rows={4}
                                />
                            ) : field.type === 'image' ? (
                                <div className="space-y-2">
                                    <label
                                        htmlFor={field.name}
                                        onDragOver={(event) => {
                                            event.preventDefault();
                                            setDragField(field.name);
                                        }}
                                        onDragLeave={() => setDragField(null)}
                                        onDrop={(event) => {
                                            event.preventDefault();
                                            setDragField(null);
                                            const file = event.dataTransfer.files?.[0];
                                            if (file) {
                                                readFile(file, field.name);
                                            }
                                        }}
                                        className={
                                            dragField === field.name
                                                ? 'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary bg-primary/5 p-6 text-center transition'
                                                : 'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border p-6 text-center transition hover:border-primary/60 hover:bg-muted/40'
                                        }
                                    >
                                        {values[field.name] ? (
                                            <div className="relative">
                                                <img src={values[field.name]} alt="preview" className="max-h-40 rounded" />
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setValues((current) => ({ ...current, [field.name]: '' }));
                                                    }}
                                                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-6 w-6 text-muted-foreground" />
                                                <p className="text-sm font-medium">Arrastra y suelta una imagen aqui</p>
                                                <p className="text-xs text-muted-foreground">o haz clic para seleccionarla</p>
                                            </>
                                        )}
                                        <input
                                            id={field.name}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            required={field.required && !values[field.name]}
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (file) {
                                                    readFile(file, field.name);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <Input
                                    id={field.name}
                                    type="text"
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    value={values[field.name] ?? ''}
                                    onChange={(event) => {
                                        setValues((current) => ({ ...current, [field.name]: event.target.value }));
                                    }}
                                />
                            )}
                        </div>
                    ))}
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}