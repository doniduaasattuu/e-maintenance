import { Equipment, type NavItem } from '@/types';
import AssetLayout from '../asset/layout';

interface Props {
    equipment: Equipment;
    className?: string;
    children: React.ReactNode | undefined;
}

export default function EquipmentLayout({ equipment, className, children }: Props) {
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
            permission: 'show_installdismantlehistory',
        },
        {
            title: 'Inspection',
            href: route('inspections.create', equipment.id), // http://127.0.0.1:8000/equipments/1/inspection
            icon: null,
            permission: 'create_inspection',
        },
        {
            title: 'Images',
            href: route('images.equipment.index', {
                id: equipment.id,
                type: 'equipment',
            }),
            icon: null,
            permission: 'show_image',
        },
        {
            title: 'Repositories',
            href: route('equipments.repositories', equipment.id),
            icon: null,
            permission: 'show_repository',
        },
    ];

    return (
        <AssetLayout sidebarNavItems={sidebarNavItems} className={className}>
            {children}
        </AssetLayout>
    );
}
