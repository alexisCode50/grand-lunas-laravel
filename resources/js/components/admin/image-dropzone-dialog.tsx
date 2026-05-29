import { useCallback, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageDropzoneDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (images: string[]) => void;
}

export function ImageDropzoneDialog({ open, onOpenChange, onSubmit }: ImageDropzoneDialogProps) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const readFile = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Solo se permiten imagenes'));
                return;
            }

            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
            reader.readAsDataURL(file);
        });

    const handleFiles = async (files: FileList | null) => {
        if (!files) {
            return;
        }

        const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
        const results = await Promise.all(fileArray.map(readFile));

        setPreviews((prev) => [...prev, ...results]);
    };

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        void handleFiles(event.dataTransfer.files);
    }, []);

    const handleSubmit = () => {
        if (previews.length === 0) {
            return;
        }

        onSubmit(previews);
        setPreviews([]);
        onOpenChange(false);
    };

    const handleOpenChange = (value: boolean) => {
        if (!value) {
            setPreviews([]);
        }

        onOpenChange(value);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Agregar imagenes al carrusel</DialogTitle>
                    <DialogDescription>
                        Arrastra y suelta las imagenes aqui o haz clic para seleccionarlas desde tu computadora.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div
                        onDrop={onDrop}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragOver(true);
                        }}
                        onDragLeave={(event) => {
                            event.preventDefault();
                            setIsDragOver(false);
                        }}
                        className={cn(
                            'relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors',
                            isDragOver
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 bg-muted/40 hover:bg-muted/60',
                        )}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            onChange={(event) => {
                                void handleFiles(event.target.files);
                            }}
                        />
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-foreground">Arrastra las imagenes aqui</p>
                            <p className="text-xs text-muted-foreground">O haz clic para seleccionar archivos</p>
                        </div>
                    </div>

                    {previews.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {previews.map((src, index) => (
                                <div
                                    key={`${src.slice(0, 20)}-${index}`}
                                    className="group relative aspect-video overflow-hidden rounded-lg border"
                                >
                                    <img src={src} alt={`Vista previa ${index + 1}`} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviews((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
                                        }}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                                        #{index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={previews.length === 0}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Guardar {previews.length > 0 ? `(${previews.length})` : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}