import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Home, Images, Info, LayoutDashboard, Wrench } from 'lucide-react';
import { AdminPanelLayout } from '@/layouts/admin-layout';
import { PageHeader } from '@/components/admin/page-header';

export default function Dashboard() {
    const pages = [
        {
            href: '/dashboard/inicio',
            label: 'Pagina de inicio',
            description: 'Carrusel, tarjetas, listado y preguntas frecuentes.',
            icon: Home,
            sections: 4,
        },
        {
            href: '/dashboard/nosotros',
            label: 'Pagina de nosotros',
            description: 'Tarjetas de presentacion e informacion.',
            icon: Info,
            sections: 2,
        },
        {
            href: '/dashboard/servicios',
            label: 'Pagina de servicios',
            description: 'Tarjetas de servicios y preguntas frecuentes.',
            icon: Wrench,
            sections: 2,
        },
        {
            href: '/dashboard/galeria',
            label: 'Pagina de galeria',
            description: 'Carrusel de imagenes de la galeria.',
            icon: Images,
            sections: 1,
        },
    ] as const;

    return (
        <>
            <Head title="Inicio del panel" />
            <AdminPanelLayout>
                <PageHeader
                    title="Bienvenido al panel de Grand Lunas"
                    subtitle="Elige una pagina del sitio para editar su contenido. Cada seccion tiene botones claros para agregar, editar y eliminar la informacion."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    {pages.map((page) => {
                        const Icon = page.icon;

                        return (
                            <Link
                                key={page.href}
                                href={page.href}
                                className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-foreground">{page.label}</h3>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
                                    <p className="mt-3 inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                                        {page.sections} {page.sections === 1 ? 'seccion' : 'secciones'}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        Consejo
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Los cambios que guardes aqui se reflejaran en el sitio publico. Si tienes dudas, usa los botones
                        <span className="mx-1 font-medium text-primary">Agregar</span>
                        o <span className="font-medium text-primary">Editar</span> dentro de cada seccion.
                    </p>
                </div>
            </AdminPanelLayout>
        </>
    );
}
