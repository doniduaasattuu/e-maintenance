import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const tabItems: NavItem[] = [
    {
        title: 'Department',
        href: '/organizations/departments',
        icon: null,
    },
    {
        title: 'Division',
        href: '/organizations/divisions',
        icon: null,
    },
    {
        title: 'Work Center',
        href: '/organizations/work-centers',
        icon: null,
    },
];

export default function OrganizationsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Organizations" description="Manage organizations data and information" />

            <div className="space-y-6">
                <div className="sm:bg-muted text-muted-foreground flex flex-col gap-1 rounded-lg sm:inline-flex sm:flex-row sm:p-1">
                    {tabItems.map((item) => {
                        const isActive = currentPath.includes(item.href);

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

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-4xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
