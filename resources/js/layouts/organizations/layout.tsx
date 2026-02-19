import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { cn, removeOrigin } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

const tabItems: NavItem[] = [
    {
        title: 'Departments',
        href: route('departments.index'),
        icon: null,
    },
    {
        title: 'Divisions',
        href: route('divisions.index'),
        icon: null,
    },
    {
        title: 'Work Centers',
        href: route('work-centers.index'),
        icon: null,
    },
];

interface Props {
    className?: string;
    children: React.ReactNode;
}

export default function OrganizationsLayout({ className, children }: Props) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className={cn('p-4', className)}>
            <Heading title="Organizations" description="Manage organizations data and information" className="mb-8" />

            <div className="space-y-6">
                <div className="sm:bg-muted text-muted-foreground flex flex-col gap-1 rounded-lg sm:inline-flex sm:flex-row sm:p-1">
                    {tabItems.map((item) => {
                        const isActive = currentPath.includes(removeOrigin(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                                    isActive && 'bg-muted sm:bg-background text-foreground',
                                )}
                                prefetch
                            >
                                {item.title}
                            </Link>
                        );
                    })}
                </div>

                <Separator className="my-6 md:hidden" />

                <section className="max-w-3xl space-y-12">{children}</section>
            </div>
        </div>
    );
}
