import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ItemDialog, type FieldDef } from '@/components/admin/item-dialog';
import { EmptyState, SectionShell } from '@/components/admin/section-shell';
import type { FAQ } from '@/components/admin/types';
import { useCrud } from '@/components/admin/use-crud';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const fields: FieldDef[] = [
    { name: 'question', label: 'Pregunta', type: 'text', required: true, placeholder: 'Ej. Cual es el horario?' },
    { name: 'answer', label: 'Respuesta', type: 'textarea', required: true },
];

interface Props {
    number: number;
    seed?: FAQ[];
}

export function FaqSection({ number, seed = [] }: Props) {
    const { items, create, update, remove } = useCrud<FAQ>(seed);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<FAQ | null>(null);

    return (
        <>
            <SectionShell
                number={number}
                title="Preguntas frecuentes"
                description="Listado de preguntas y respuestas que se mostraran en el sitio."
                actions={
                    <Button
                        onClick={() => {
                            setEditing(null);
                            setOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Agregar pregunta
                    </Button>
                }
            >
                {items.length === 0 ? (
                    <EmptyState
                        message="No hay preguntas frecuentes todavia."
                        action={
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditing(null);
                                    setOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Agregar la primera
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        <Accordion type="single" collapsible className="rounded-lg border bg-background">
                            {items.map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id} className="px-4">
                                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="space-y-3 text-muted-foreground">
                                        <p>{faq.answer}</p>
                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditing(faq);
                                                    setOpen(true);
                                                }}
                                            >
                                                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => remove(faq.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Eliminar
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </SectionShell>

            <ItemDialog
                open={open}
                onOpenChange={setOpen}
                title={editing ? 'Editar pregunta' : 'Nueva pregunta frecuente'}
                description="Redacta la pregunta tal como la vera el visitante y su respuesta."
                fields={fields}
                initialValues={editing ? (editing as unknown as Record<string, string>) : undefined}
                onSubmit={(values) => {
                    if (editing) {
                        update(editing.id, values as Partial<FAQ>);
                    } else {
                        create(values as Omit<FAQ, 'id'>);
                    }

                    setEditing(null);
                }}
            />
        </>
    );
}