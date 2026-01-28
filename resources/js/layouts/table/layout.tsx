import Heading from '@/components/heading';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';

interface TableLayoutProps {
    title: string;
    description: string;
    className?: string;
    children: React.ReactNode | undefined;
    action?: React.ReactNode | undefined;
}

export default function TableLayout({ title, description, className, action, children }: TableLayoutProps) {
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="flex h-full flex-1 flex-col rounded-xl p-4">
            <div className="mb-8 flex items-center justify-between gap-2 align-top">
                <div>
                    <Head title={title} />
                    <Heading title={title} description={description} />
                </div>
                {action}
            </div>

            <div className={cn('space-y-4', className)}>{children}</div>
        </div>
    );
}
