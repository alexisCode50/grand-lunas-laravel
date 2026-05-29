import type { ReactNode } from 'react';

interface SectionShellProps {
    number: number;
    title: string;
    description: string;
    actions?: ReactNode;
    children: ReactNode;
}

export function SectionShell({ number, title, description, actions, children }: SectionShellProps) {
    return (
        <section className="rounded-xl border bg-card shadow-sm">
            <header className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground">
                        {number}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
                {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/40 p-10 text-center">
            <p className="text-sm text-muted-foreground">{message}</p>
            {action}
        </div>
    );
}