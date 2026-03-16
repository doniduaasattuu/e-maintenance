/* eslint-disable @typescript-eslint/no-explicit-any */
import Heading from '@/components/heading';
import { UI_STRINGS } from '@/lib/ui-strings';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';

interface TableLayoutProps {
    title?: string;
    className?: string;
    action?: React.ReactNode | undefined;
    children: React.ReactNode | undefined;
    moduleKey: keyof typeof UI_STRINGS;
}

export default function TableLayout({ title, className, action, children, moduleKey }: TableLayoutProps) {
    if (typeof window === 'undefined') {
        return null;
    }

    const module = UI_STRINGS[moduleKey] as any;

    return (
        <div className="flex h-full flex-1 flex-col rounded-xl p-4">
            <div className="mb-8 flex items-center justify-between gap-2 align-top">
                <div>
                    <Head title={title ? title : module.label} />
                    <Heading title={module.label} description={module.description} />
                </div>
                {action}
            </div>

            <div className={cn('space-y-4', className)}>{children}</div>
        </div>
    );
}
