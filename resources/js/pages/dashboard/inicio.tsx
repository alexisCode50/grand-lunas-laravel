import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/admin/page-header';
import { CarouselSection } from '@/components/admin/sections/carousel-section';
import { FaqSection } from '@/components/admin/sections/faq-section';
import { InfoCardsSection } from '@/components/admin/sections/info-cards-section';
import { ListSection } from '@/components/admin/sections/list-section';
import type { CarouselImage, InfoCard, ListItem } from '@/components/admin/types';
import { AdminPanelLayout } from '@/layouts/admin-layout';

interface Props {
    carouselImages: CarouselImage[];
    infoCards: InfoCard[];
    listItems: ListItem[];
}

export default function DashboardInicio({ carouselImages, infoCards, listItems }: Props) {
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
                        seed={infoCards}
                    />
                    <ListSection
                        number={3}
                        seed={listItems}
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