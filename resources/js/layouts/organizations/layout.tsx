import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { UI_STRINGS } from '@/lib/ui-strings';
import { cn, removeOrigin } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

const tabItems: NavItem[] = [
    {
        title: 'Department',
        href: route('departments.index'),
        icon: null,
    },
    {
        title: 'Division',
        href: route('divisions.index'),
        icon: null,
    },
    {
        title: 'Work Center',
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
    const strings = UI_STRINGS;

    return (
        <div className={cn('p-4', className)}>
            <Heading
                title={strings.ORGANIZATION?.label ?? 'Organizations'}
                description={strings.ORGANIZATION?.description ?? 'Manage organizations data and information'}
                className="mb-8"
            />

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

                <section className="max-w-3xl space-y-4">{children}</section>
            </div>
        </div>
    );
}
