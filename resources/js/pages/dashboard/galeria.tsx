import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/admin/page-header';
import { CarouselSection } from '@/components/admin/sections/carousel-section';
import { AdminPanelLayout } from '@/layouts/admin-layout';

export default function DashboardGaleria() {
    return (
        <>
            <Head title="Pagina de galeria" />
            <AdminPanelLayout>
                <PageHeader
                    title="Pagina de galeria"
                    subtitle="Sube y administra las imagenes que se mostraran en la galeria del sitio."
                />
                <div className="space-y-6">
                    <CarouselSection number={1} title="Carrusel de la galeria" />
                </div>
            </AdminPanelLayout>
        </>
    );
}