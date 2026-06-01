import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { ItemDialog, type FieldDef, type FormValue } from '@/components/admin/item-dialog';
import { EmptyState, SectionShell } from '@/components/admin/section-shell';
import type { InfoCard } from '@/components/admin/types';
import { Button } from '@/components/ui/button';

const defaultFields: FieldDef[] = [
    { name: 'title', label: 'Título de la tarjeta', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    { name: 'imageUrl', label: 'Imagen', type: 'image', required: true },
];

interface Props {
    number: number;
    title?: string;
    description?: string;
    seed?: InfoCard[];
    fields?: FieldDef[];
    resourcePath?: string;
    maxItems?: number;
}

export function InfoCardsSection({
    number,
    title = 'Tarjetas con información',
    description = 'Bloques con título, texto e imagen obligatoria.',
    seed = [],
    fields,
    resourcePath = '/dashboard/inicio/tarjetas',
    maxItems = 3,
}: Props) {
    const activeFields = fields ?? defaultFields;
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<InfoCard | null>(null);
    const items = seed;
    const canCreateMore = items.length < maxItems;

    const handleSubmit = (values: Record<string, FormValue>) => {
        const formData = new FormData();
        const title = typeof values.title === 'string' ? values.title : '';
        const imageValue = values.imageUrl;
        const hasDescriptionField = activeFields.some((field) => field.name === 'description');

        formData.append('title', title);

        if (hasDescriptionField) {
            const descriptionValue = typeof values.description === 'string' ? values.description : '';
            formData.append('description', descriptionValue);
        }

        if (imageValue instanceof File) {
            formData.append('image', imageValue);
        }

        if (editing) {
            formData.append('_method', 'put');

            router.post(`${resourcePath}/${editing.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditing(null);
                    setOpen(false);
                },
            });

            return;
        }

        router.post(resourcePath, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(null);
                setOpen(false);
            },
        });
    };

    const handleDelete = (id: InfoCard['id']) => {
        router.delete(`${resourcePath}/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <SectionShell
                number={number}
                title={title}
                description={description}
                actions={
                    <Button
                        disabled={!canCreateMore}
                        onClick={() => {
                            setEditing(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Agregar tarjeta
                    </Button>
                }
            >
                {items.length === 0 ? (
                    <EmptyState
                        message="Todavía no hay tarjetas creadas."
                        action={
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditing(null);
                                    setOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Crear la primera tarjeta
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {!canCreateMore ? (
                            <p className="text-sm text-muted-foreground">
                                Ya alcanzaste el máximo de {maxItems} tarjetas. Elimina una para poder crear otra.
                            </p>
                        ) : null}
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((card) => (
                                <li key={card.id} className="overflow-hidden rounded-lg border bg-background">
                                    <div className="aspect-4/3 w-full bg-muted">
                                        {card.imageUrl ? (
                                            <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                                <ImageIcon className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 p-4">
                                        <h3 className="font-semibold text-foreground">{card.title}</h3>
                                        {card.description ? <p className="line-clamp-3 text-sm text-muted-foreground">{card.description}</p> : null}
                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditing(card);
                                                    setOpen(true);
                                                }}
                                            >
                                                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(card.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </SectionShell>

            <ItemDialog
                open={open}
                onOpenChange={(nextOpen) => {
                    setOpen(nextOpen);

                    if (!nextOpen) {
                        setEditing(null);
                    }
                }}
                title={editing ? 'Editar tarjeta' : 'Nueva tarjeta'}
                description="Completa el contenido que verán los visitantes del sitio."
                fields={activeFields}
                initialValues={editing ? (editing as unknown as Record<string, FormValue>) : undefined}
                onSubmit={handleSubmit}
            />
        </>
    );
}