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
        <div className="space-y-6 px-4 py-6">
            <div className="mb-8 flex items-center justify-between gap-2 align-top">
                <div>
                    <Head title={title} />
                    <Heading title={title} description={description} />
                </div>
                {action}
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <div className={cn('flex-1 space-y-2', className ?? 'md:max-w-7xl')}>{children}</div>
            </div>
        </div>
    );
}
