import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/admin/page-header';
import { CarouselSection } from '@/components/admin/sections/carousel-section';
import { FaqSection } from '@/components/admin/sections/faq-section';
import { InfoCardsSection } from '@/components/admin/sections/info-cards-section';
import { ListSection } from '@/components/admin/sections/list-section';
import type { CarouselImage } from '@/components/admin/types';
import { AdminPanelLayout } from '@/layouts/admin-layout';

interface Props {
    carouselImages: CarouselImage[];
}

export default function DashboardInicio({ carouselImages }: Props) {
    return (
        <>
            <Head title="Pagina de inicio" />
            <AdminPanelLayout>
                <PageHeader
                    title="Pagina de inicio"
                    subtitle="Esta es la primera pagina que veran tus visitantes. Gestiona cada una de sus secciones."
                />
                <div className="space-y-6">
                    <CarouselSection
                        number={1}
                        seed={carouselImages}
                    />
                    <InfoCardsSection
                        number={2}
                        seed={[
                            {
                                id: 'ic1',
                                title: 'Ubicacion privilegiada',
                                description: 'A pocos minutos de los principales atractivos turisticos.',
                                imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
                            },
                        ]}
                    />
                    <ListSection
                        number={3}
                        seed={[
                            {
                                id: 'l1',
                                title: 'Atencion personalizada',
                                description: 'Nuestro equipo esta disponible para ti.',
                            },
                            {
                                id: 'l2',
                                title: 'Espacios comodos',
                                description: 'Disenados para tu descanso.',
                            },
                        ]}
                    />
                    <FaqSection
                        number={4}
                        seed={[
                            {
                                id: 'f1',
                                question: 'Cual es el horario?',
                                answer: 'Atendemos todos los dias de 9:00 a 21:00 h.',
                            },
                        ]}
                    />
                </div>
            </AdminPanelLayout>
        </>
    );
}