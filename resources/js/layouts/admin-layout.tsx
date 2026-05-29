import { Link } from '@inertiajs/react';
import { Home, Images, Info, LifeBuoy, LayoutDashboard, Wrench } from 'lucide-react';
import type { ComponentType, PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

interface NavItem {
    href: string;
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Inicio del panel', description: 'Resumen', icon: LayoutDashboard },
    { href: '/dashboard/inicio', label: 'Pagina de inicio', description: '4 secciones', icon: Home },
    { href: '/dashboard/nosotros', label: 'Pagina de nosotros', description: '2 secciones', icon: Info },
    { href: '/dashboard/servicios', label: 'Pagina de servicios', description: '2 secciones', icon: Wrench },
    { href: '/dashboard/galeria', label: 'Pagina de galeria', description: '1 seccion', icon: Images },
];

export function AdminPanelLayout({ children }: PropsWithChildren) {
    const { currentUrl, isCurrentUrl } = useCurrentUrl();

    return (
        <div className="flex min-h-screen bg-muted/30 text-foreground">
            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
                <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
                    <img
                        src="https://yucatan.lacasadelaslunas.com/logo-grand-lunas-yucatan.svg"
                        alt="Grand Lunas Yucatan"
                        className="h-10 w-auto"
                    />
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
                        Navegacion
                    </p>
                    {navItems.map((item) => {
                        const active = isCurrentUrl(item.href, currentUrl);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                                    active
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                        : 'text-sidebar-foreground/85 hover:bg-sidebar-accent',
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="flex-1">
                                    <span className="block font-medium">{item.label}</span>
                                    <span
                                        className={cn(
                                            'block text-[11px]',
                                            active
                                                ? 'text-sidebar-primary-foreground/80'
                                                : 'text-sidebar-foreground/55',
                                        )}
                                    >
                                        {item.description}
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-sidebar-border p-4">
                    <div className="flex items-start gap-3 rounded-md bg-sidebar-accent p-3">
                        <LifeBuoy className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="text-xs leading-snug text-sidebar-foreground/85">
                            <p className="font-medium text-sidebar-foreground">Necesitas ayuda?</p>
                            <p className="text-sidebar-foreground/70">
                                Cada seccion incluye instrucciones claras para crear, editar y eliminar.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex w-full min-w-0 flex-col">
                <header className="flex items-center justify-between border-b bg-background px-4 py-3 lg:hidden">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://yucatan.lacasadelaslunas.com/logo-grand-lunas-yucatan.svg"
                            alt="Grand Lunas Yucatan"
                            className="h-8 w-auto"
                        />
                        <span className="text-sm font-semibold">Panel</span>
                    </div>
                </header>

                <nav className="flex gap-2 overflow-x-auto border-b bg-background px-4 py-2 lg:hidden">
                    {navItems.map((item) => {
                        const active = isCurrentUrl(item.href, currentUrl);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-accent',
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
                    <div className="mx-auto w-full max-w-6xl">{children}</div>
                </main>
            </div>
        </div>
    );
}