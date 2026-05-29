import { router } from '@inertiajs/react';
import { useState } from 'react';
import { List, Pencil, Plus, Trash2 } from 'lucide-react';
import { ItemDialog, type FieldDef, type FormValue } from '@/components/admin/item-dialog';
import { EmptyState, SectionShell } from '@/components/admin/section-shell';
import type { ListItem } from '@/components/admin/types';
import { Button } from '@/components/ui/button';

const fields: FieldDef[] = [
    { name: 'title', label: 'Titulo del elemento', type: 'text', required: true },
    { name: 'description', label: 'Descripcion', type: 'textarea', required: true },
    { name: 'imageUrl', label: 'Imagen', type: 'image', required: true },
];

interface Props {
    number: number;
    seed?: ListItem[];
}

export function ListSection({ number, seed = [] }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ListItem | null>(null);
    const items = seed;

    const handleSubmit = (values: Record<string, FormValue>) => {
        const formData = new FormData();
        const title = typeof values.title === 'string' ? values.title : '';
        const description = typeof values.description === 'string' ? values.description : '';
        const imageValue = values.imageUrl;

        formData.append('title', title);
        formData.append('description', description);

        if (imageValue instanceof File) {
            formData.append('image', imageValue);
        }

        if (editing) {
            formData.append('_method', 'put');

            router.post(`/dashboard/inicio/listado/${editing.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditing(null);
                    setOpen(false);
                },
            });

            return;
        }

        router.post('/dashboard/inicio/listado', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(null);
                setOpen(false);
            },
        });
    };

    const handleDelete = (id: ListItem['id']) => {
        router.delete(`/dashboard/inicio/listado/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <SectionShell
                number={number}
                title="Listado con informacion"
                description="Elementos con titulo, descripcion e imagen obligatoria."
                actions={
                    <Button
                        onClick={() => {
                            setEditing(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Agregar elemento
                    </Button>
                }
            >
                {items.length === 0 ? (
                    <EmptyState
                        message="No hay elementos en el listado."
                        action={
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditing(null);
                                    setOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Crear el primero
                            </Button>
                        }
                    />
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <li key={item.id} className="overflow-hidden rounded-lg border bg-background">
                                <div className="h-40 w-full overflow-hidden bg-muted">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <List className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 p-4">
                                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                                    <p className="line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
                                    <div className="flex gap-2 pt-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditing(item);
                                                setOpen(true);
                                            }}
                                        >
                                            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(item.id)}
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
                onOpenChange={(nextOpen) => {
                    setOpen(nextOpen);

                    if (!nextOpen) {
                        setEditing(null);
                    }
                }}
                title={editing ? 'Editar elemento' : 'Nuevo elemento'}
                description="Escribe el contenido del elemento del listado."
                fields={fields}
                initialValues={editing ? (editing as unknown as Record<string, FormValue>) : undefined}
                onSubmit={handleSubmit}
            />
        </>
    );
}