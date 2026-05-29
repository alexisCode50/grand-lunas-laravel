import { useState } from 'react';
import { List, Pencil, Plus, Trash2 } from 'lucide-react';
import { ItemDialog, type FieldDef } from '@/components/admin/item-dialog';
import { EmptyState, SectionShell } from '@/components/admin/section-shell';
import type { ListItem } from '@/components/admin/types';
import { useCrud } from '@/components/admin/use-crud';
import { Button } from '@/components/ui/button';

const fields: FieldDef[] = [
    { name: 'title', label: 'Titulo del elemento', type: 'text', required: true },
    { name: 'description', label: 'Descripcion', type: 'textarea', required: true },
];

interface Props {
    number: number;
    seed?: ListItem[];
}

export function ListSection({ number, seed = [] }: Props) {
    const { items, create, update, remove } = useCrud<ListItem>(seed);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ListItem | null>(null);

    return (
        <>
            <SectionShell
                number={number}
                title="Listado con informacion"
                description="Elementos cortos con titulo y descripcion."
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
                                <div className="flex h-40 w-full items-center justify-center bg-muted">
                                    <List className="h-10 w-10 text-muted-foreground" />
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
                                            onClick={() => remove(item.id)}
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
                title={editing ? 'Editar elemento' : 'Nuevo elemento'}
                description="Escribe el contenido del elemento del listado."
                fields={fields}
                initialValues={editing ? (editing as unknown as Record<string, string>) : undefined}
                onSubmit={(values) => {
                    if (editing) {
                        update(editing.id, values as Partial<ListItem>);
                    } else {
                        create(values as Omit<ListItem, 'id'>);
                    }

                    setEditing(null);
                }}
            />
        </>
    );
}