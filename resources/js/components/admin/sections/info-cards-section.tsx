import { useState } from 'react';
import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { ItemDialog, type FieldDef } from '@/components/admin/item-dialog';
import { EmptyState, SectionShell } from '@/components/admin/section-shell';
import type { InfoCard } from '@/components/admin/types';
import { useCrud } from '@/components/admin/use-crud';
import { Button } from '@/components/ui/button';

const defaultFields: FieldDef[] = [
    { name: 'title', label: 'Titulo de la tarjeta', type: 'text', required: true },
    { name: 'description', label: 'Descripcion', type: 'textarea', required: true },
    { name: 'imageUrl', label: 'Imagen (opcional)', type: 'image' },
];

interface Props {
    number: number;
    title?: string;
    description?: string;
    seed?: InfoCard[];
    fields?: FieldDef[];
}

export function InfoCardsSection({
    number,
    title = 'Tarjetas con informacion',
    description = 'Bloques con titulo, texto y una imagen opcional.',
    seed = [],
    fields,
}: Props) {
    const activeFields = fields ?? defaultFields;
    const { items, create, update, remove } = useCrud<InfoCard>(seed);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<InfoCard | null>(null);

    return (
        <>
            <SectionShell
                number={number}
                title={title}
                description={description}
                actions={
                    <Button
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
                        message="Todavia no hay tarjetas creadas."
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
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((card) => (
                            <li key={card.id} className="overflow-hidden rounded-lg border bg-background">
                                <div className="aspect-[4/3] w-full bg-muted">
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
                                            onClick={() => remove(card.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </SectionShell>

            <ItemDialog
                open={open}
                onOpenChange={setOpen}
                title={editing ? 'Editar tarjeta' : 'Nueva tarjeta'}
                description="Completa el contenido que veran los visitantes del sitio."
                fields={activeFields}
                initialValues={editing ? (editing as unknown as Record<string, string>) : undefined}
                onSubmit={(values) => {
                    if (editing) {
                        update(editing.id, values as Partial<InfoCard>);
                    } else {
                        create(values as Omit<InfoCard, 'id'>);
                    }

                    setEditing(null);
                }}
            />
        </>
    );
}