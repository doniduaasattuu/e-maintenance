import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import usePermissions from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

interface Props {
    children: React.ReactNode | undefined;
    sidebarNavItems: NavItem[];
    className?: string;
}

export default function AssetLayout({ children, className, sidebarNavItems }: Props) {
    const { can: permissions } = usePermissions();
    const { url } = usePage();
    const scrollContainerRef = useRef<HTMLElement>(null);

    // UX Logic: Simpan dan Kembalikan posisi scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // 1. Ambil posisi terakhir dari sessionStorage saat mount/navigasi
        const savedScrollPos = sessionStorage.getItem('sidebar-scroll-pos');
        if (savedScrollPos) {
            container.scrollLeft = parseInt(savedScrollPos, 10);
            container.scrollTop = parseInt(savedScrollPos, 10);
        }

        // 2. Fungsi untuk menyimpan posisi saat user melakukan scroll
        const handleScroll = () => {
            // Kita simpan baik horizontal (untuk mobile) maupun vertical (untuk desktop)
            const position = container.scrollLeft || container.scrollTop;
            sessionStorage.setItem('sidebar-scroll-pos', position.toString());
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [url]);

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="space-y-6 px-4 py-6">
            <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-12">
                <aside className={cn('max-w-xl lg:w-48', sidebarNavItems.length > 4 ? 'pt-2' : undefined)}>
                    <nav
                        ref={scrollContainerRef}
                        className={cn(
                            'flex flex-col space-y-1 space-x-0',
                            sidebarNavItems.length > 4
                                ? 'flex flex-row space-y-1 space-x-1 overflow-x-scroll sm:flex-col sm:space-x-1 sm:overflow-x-hidden'
                                : undefined,
                        )}
                    >
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

                <div className={className}>{children}</div>
            </div>
        </div>
    );
}
