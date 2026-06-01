import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/admin/page-header';
import { CarouselSection } from '@/components/admin/sections/carousel-section';
import type { CarouselImage } from '@/components/admin/types';
import { AdminPanelLayout } from '@/layouts/admin-layout';

interface Props {
    carouselImages: CarouselImage[];
}

export default function DashboardGaleria({ carouselImages }: Props) {
    return (
        <>
            <Head title="Pagina de galeria" />
            <AdminPanelLayout>
                <PageHeader
                    title="Pagina de galeria"
                    subtitle="Sube y administra las imagenes que se mostraran en la galeria del sitio."
                />
                <div className="space-y-6">
                    <CarouselSection
                        number={1}
                        title="Carrusel de la galeria"
                        description="Imagenes destacadas que se mostraran en la pagina de galeria."
                        emptyMessage="Aun no hay imagenes en el carrusel de la galeria."
                        storeUrl="/dashboard/galeria/carrusel"
                        destroyUrlBase="/dashboard/galeria/carrusel"
                        seed={carouselImages}
                    />
                </div>
            </AdminPanelLayout>
        </>
    );
}