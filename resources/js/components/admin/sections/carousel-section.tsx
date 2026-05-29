import { useState } from 'react';
import { ImageIcon, Plus, Trash2 } from 'lucide-react';
import { ImageDropzoneDialog } from '@/components/admin/image-dropzone-dialog';
import { EmptyState, SectionShell } from '@/components/admin/section-shell';
import type { CarouselImage } from '@/components/admin/types';
import { useCrud } from '@/components/admin/use-crud';
import { Button } from '@/components/ui/button';

interface Props {
    number: number;
    title?: string;
    seed?: CarouselImage[];
}

export function CarouselSection({ number, title = 'Carrusel de imagenes', seed = [] }: Props) {
    const { items, create, remove } = useCrud<CarouselImage>(seed);
    const [open, setOpen] = useState(false);

    return (
        <>
            <SectionShell
                number={number}
                title={title}
                description="Imagenes grandes que se muestran al inicio de la pagina, una tras otra."
                actions={
                    <Button onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Agregar imagen
                    </Button>
                }
            >
                {items.length === 0 ? (
                    <EmptyState
                        message="Aun no hay imagenes en el carrusel."
                        action={
                            <Button variant="outline" onClick={() => setOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Agregar la primera imagen
                            </Button>
                        }
                    />
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((image, index) => (
                            <li key={image.id} className="group relative overflow-hidden rounded-lg border bg-background">
                                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                    {image.imageUrl ? (
                                        <img src={image.imageUrl} alt={`Carrusel ${index + 1}`} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                    )}
                                    <span className="absolute left-2 top-2 rounded bg-foreground/80 px-2 py-0.5 text-xs font-medium text-background">
                                        #{index + 1}
                                    </span>
                                </div>
                                <div className="flex justify-end p-3">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => remove(image.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Eliminar
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </SectionShell>

            <ImageDropzoneDialog
                open={open}
                onOpenChange={setOpen}
                onSubmit={(images) => {
                    images.forEach((imageUrl) => create({ imageUrl }));
                }}
            />
        </>
    );
}