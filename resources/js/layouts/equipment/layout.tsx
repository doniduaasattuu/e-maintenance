import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Equipment, SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface Props {
    equipment: Equipment;
    width?: string;
    children: React.ReactNode | undefined;
}

export default function EquipmentLayout({ equipment, width, children }: Props) {
    const { permissions } = usePage<SharedData>().props;
    const sidebarNavItems: NavItem[] = [
        {
            title: 'Details',
            href: route('equipments.show', equipment.id), // http://127.0.0.1:8000/equipments/1
            icon: null,
        },
        {
            title: 'History',
            href: route('equipments.history', equipment.id), // http://127.0.0.1:8000/equipments/1/history
            icon: null,
            permission: 'read_installdismantlehistory',
        },
        {
            title: 'Inspection',
            href: route('inspections.create', equipment.id), // http://127.0.0.1:8000/equipments/1/inspection
            icon: null,
            permission: 'create_inspection',
        },
        {
            title: 'Image',
            href: route('equipments.image', equipment.id), // http://127.0.0.1:8000/equipments/1/image
            icon: null,
            permission: 'read_equipmentimage',
        },
    ];

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="space-y-6 px-4 py-6">
            {/* <Heading title="Equipment" description="An individual, physical object that is to be maintained independently." /> */}

            <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            const shouldRender = !item.permission || permissions[item.permission] === true;
                            // const active =
                            //     window.location.pathname.startsWith(item.href.replace(window.location.origin, '')) ||
                            //     route('equipments.show', equipment.id) == item.href
                            //         ? window.location.href.endsWith(item.href)
                            //         : window.location.href.includes(item.href);

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
