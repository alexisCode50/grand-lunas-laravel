interface PageHeaderProps {
    title: string;
    subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-2 border-b pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Administracion del sitio
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="max-w-2xl text-base text-muted-foreground">{subtitle}</p>
        </div>
    );
}