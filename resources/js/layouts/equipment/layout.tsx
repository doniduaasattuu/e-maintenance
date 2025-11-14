import { Equipment, type NavItem } from '@/types';
import AssetLayout from '../asset/layout';

interface Props {
    equipment: Equipment;
    width?: string;
    children: React.ReactNode | undefined;
}

export default function EquipmentLayout({ equipment, width, children }: Props) {
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
            href: route('images.index', ['equipment', equipment.id]),
            icon: null,
            permission: 'read_image',
        },
    ];

    return (
        <AssetLayout sidebarNavItems={sidebarNavItems} width={width}>
            {children}
        </AssetLayout>
    );
}
