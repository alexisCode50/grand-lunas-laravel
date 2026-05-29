import { Head } from '@inertiajs/react';
import { type FieldDef } from '@/components/admin/item-dialog';
import { PageHeader } from '@/components/admin/page-header';
import { InfoCardsSection } from '@/components/admin/sections/info-cards-section';
import { AdminPanelLayout } from '@/layouts/admin-layout';

const startCardsFields: FieldDef[] = [
    { name: 'title', label: 'Titulo de la tarjeta', type: 'text', required: true },
    { name: 'imageUrl', label: 'Imagen (opcional)', type: 'image' },
];

export default function DashboardNosotros() {
    return (
        <>
            <Head title="Pagina de nosotros" />
            <AdminPanelLayout>
                <PageHeader
                    title="Pagina de nosotros"
                    subtitle="Cuenta a tus visitantes quienes son y que los hace especiales."
                />
                <div className="space-y-6">
                    <InfoCardsSection
                        number={1}
                        title="Tarjetas de inicio"
                        description="Tarjetas destacadas que aparecen al inicio de la pagina."
                        fields={startCardsFields}
                    />
                    <InfoCardsSection
                        number={2}
                        title="Tarjetas con informacion"
                        description="Bloques adicionales con mas detalle sobre la empresa."
                    />
                </div>
            </AdminPanelLayout>
        </>
    );
}