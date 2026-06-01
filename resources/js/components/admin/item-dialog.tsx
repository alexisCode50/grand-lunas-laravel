import { useEffect, useMemo, useState } from 'react';
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

export type FormValue = string | File | null;

interface ItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    fields: FieldDef[];
    initialValues?: Record<string, FormValue>;
    onSubmit: (values: Record<string, FormValue>) => void;
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
    const [values, setValues] = useState<Record<string, FormValue>>({});
    const [dragField, setDragField] = useState<string | null>(null);

    const imagePreviewUrls = useMemo(() => {
        const previewMap: Record<string, string> = {};

        fields.forEach((field) => {
            if (field.type !== 'image') {
                return;
            }

            const value = values[field.name];

            if (value instanceof File) {
                previewMap[field.name] = URL.createObjectURL(value);
                return;
            }

            if (typeof value === 'string') {
                previewMap[field.name] = value;
            }
        });

        return previewMap;
    }, [fields, values]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const seed: Record<string, FormValue> = {};
        fields.forEach((field) => {
            seed[field.name] = initialValues?.[field.name] ?? '';
        });
        setValues(seed);
    }, [fields, initialValues, open]);

    useEffect(() => {
        return () => {
            Object.values(imagePreviewUrls).forEach((previewUrl) => {
                if (previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                }
            });
        };
    }, [imagePreviewUrls]);

    const readFile = (file: File, name: string) => {
        if (!file.type.startsWith('image/')) {
            return;
        }

        setValues((current) => ({ ...current, [name]: file }));
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
                    {fields.map((field) => {
                        const rawValue = values[field.name];
                        const textValue = typeof rawValue === 'string' ? rawValue : '';

                        return (
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
                                    value={textValue}
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
                                        {imagePreviewUrls[field.name] ? (
                                            <div className="relative">
                                                <img src={imagePreviewUrls[field.name]} alt="preview" className="max-h-40 rounded" />
                                                {!field.required ? (
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
                                                ) : null}
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-6 w-6 text-muted-foreground" />
                                                <p className="text-sm font-medium">Arrastra y suelta una imagen aquí</p>
                                                <p className="text-xs text-muted-foreground">o haz clic para seleccionarla</p>
                                            </>
                                        )}
                                        <input
                                            id={field.name}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            required={field.required && !imagePreviewUrls[field.name]}
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
                                    value={textValue}
                                    onChange={(event) => {
                                        setValues((current) => ({ ...current, [field.name]: event.target.value }));
                                    }}
                                />
                            )}
                        </div>
                        );
                    })}
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