import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface Props {
    width?: string;
    children: React.ReactNode | undefined;
    sidebarNavItems: NavItem[];
}

export default function AssetLayout({ width, children, sidebarNavItems }: Props) {
    const { permissions } = usePage<SharedData>().props;

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="space-y-6 px-4 py-6">
            <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            const shouldRender = !item.permission || permissions[item.permission] === true;
                            const pathname = window.location.pathname;
                            const itemPath = new URL(item.href, window.location.origin).pathname;

                            let active = false;
                            if (item.title === 'Details') {
                                active = pathname === itemPath || pathname === `${itemPath}/edit`;
                            } else {
                                active = pathname === itemPath || pathname.startsWith(itemPath + '/');
                            }

                            return shouldRender ? (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': active,
                                    })}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.title}
                                    </Link>
                                </Button>
                            ) : null;
                        })}
                    </nav>
                </aside>

                <Separator className="md:hidden" />

                <div className="flex-1 md:max-w-full">
                    <section className={`${width ?? 'md:max-w-xl'} space-y-12`}>{children}</section>
                </div>
            </div>
        </div>
    );
}
