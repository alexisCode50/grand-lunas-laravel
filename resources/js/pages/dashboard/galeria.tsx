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
            <Head title="Página de galería" />
            <AdminPanelLayout>
                <PageHeader
                    title="Página de galería"
                    subtitle="Sube y administra las imágenes que se mostrarán en la galería del sitio."
                />
                <div className="space-y-6">
                    <CarouselSection
                        number={1}
                        title="Carrusel de la galería"
                        description="Imágenes destacadas que se mostrarán en la página de galería."
                        emptyMessage="Aún no hay imágenes en el carrusel de la galería."
                        storeUrl="/dashboard/galeria/carrusel"
                        destroyUrlBase="/dashboard/galeria/carrusel"
                        seed={carouselImages}
                    />
                </div>
            </AdminPanelLayout>
        </>
    );
}