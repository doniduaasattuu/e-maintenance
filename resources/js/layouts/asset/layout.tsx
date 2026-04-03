import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import usePermissions from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    children: React.ReactNode | undefined;
    sidebarNavItems: NavItem[];
    className?: string;
}

export default function AssetLayout({ children, className, sidebarNavItems }: Props) {
    const { can: permissions } = usePermissions();

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="space-y-6 px-4 py-6">
            <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-12">
                <aside className="max-w-xl lg:w-48">
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

                {/* <div className={cn('grid min-w-0 overflow-x-auto rounded-md', className)}>{children}</div> */}
                <div className={className}>{children}</div>
            </div>
        </div>
    );
}
