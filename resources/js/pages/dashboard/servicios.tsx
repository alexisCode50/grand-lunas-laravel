import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/admin/page-header';
import { FaqSection } from '@/components/admin/sections/faq-section';
import { InfoCardsSection } from '@/components/admin/sections/info-cards-section';
import { AdminPanelLayout } from '@/layouts/admin-layout';

export default function DashboardServicios() {
    return (
        <>
            <Head title="Pagina de servicios" />
            <AdminPanelLayout>
                <PageHeader
                    title="Pagina de servicios"
                    subtitle="Muestra los servicios que ofrece Grand Lunas y resuelve las dudas mas comunes."
                />
                <div className="space-y-6">
                    <InfoCardsSection
                        number={1}
                        title="Tarjetas con informacion"
                        description="Cada tarjeta representa un servicio que ofreces."
                    />
                    <FaqSection number={2} />
                </div>
            </AdminPanelLayout>
        </>
    );
}