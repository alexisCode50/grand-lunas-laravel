import { Head } from '@inertiajs/react';
import { type FieldDef } from '@/components/admin/item-dialog';
import { PageHeader } from '@/components/admin/page-header';
import { InfoCardsSection } from '@/components/admin/sections/info-cards-section';
import type { InfoCard } from '@/components/admin/types';
import { AdminPanelLayout } from '@/layouts/admin-layout';

const startCardsFields: FieldDef[] = [
    { name: 'title', label: 'Título de la tarjeta', type: 'text', required: true },
    { name: 'imageUrl', label: 'Imagen', type: 'image', required: true },
];

interface Props {
    startCards: InfoCard[];
    infoCards: InfoCard[];
}

export default function DashboardNosotros({ startCards, infoCards }: Props) {
    return (
        <>
            <Head title="Página de nosotros" />
            <AdminPanelLayout>
                <PageHeader
                    title="Página de nosotros"
                    subtitle="Cuenta a tus visitantes quiénes son y qué los hace especiales."
                />
                <div className="space-y-6">
                    <InfoCardsSection
                        number={1}
                        title="Tarjetas de inicio"
                        description="Tarjetas destacadas que aparecen al inicio de la página."
                        seed={startCards}
                        fields={startCardsFields}
                        resourcePath="/dashboard/nosotros/tarjetas-inicio"
                    />
                    <InfoCardsSection
                        number={2}
                        title="Tarjetas con información"
                        description="Bloques adicionales con más detalle sobre la empresa."
                        seed={infoCards}
                        resourcePath="/dashboard/nosotros/tarjetas-informacion"
                    />
                </div>
            </AdminPanelLayout>
        </>
    );
}