import { UI_STRINGS } from '@/lib/ui-strings';
import { Equipment, type NavItem } from '@/types';
import AssetLayout from '../asset/layout';

interface Props {
    equipment: Equipment;
    className?: string;
    children: React.ReactNode | undefined;
}

export default function EquipmentLayout({ equipment, className, children }: Props) {
    const strings = UI_STRINGS;
    const repoTitle = strings.REPOSITORY?.label ?? 'Repository';

    const sidebarNavItems: NavItem[] = [
        {
            title: 'Details',
            href: route('equipments.show', equipment.id),
            icon: null,
        },
        {
            title: 'Finding',
            href: route('equipments.findings', equipment.id),
            icon: null,
            permission: 'show_finding',
        },
        {
            title: 'History',
            href: route('equipments.history', equipment.id),
            icon: null,
            permission: 'show_installdismantlehistory',
        },
        {
            title: 'Inspection',
            href: route('inspections.create', equipment.id),
            icon: null,
            permission: 'create_inspection',
        },
        {
            title: 'Trend',
            href: route('equipments.trend', equipment.id),
            icon: null,
            permission: 'show_equipment',
        },
        {
            title: 'Image',
            href: route('images.equipment.index', {
                id: equipment.id,
                type: 'equipment',
            }),
            icon: null,
            permission: 'show_image',
        },
        {
            title: repoTitle,
            href: route('equipments.repositories', equipment.id),
            icon: null,
            permission: 'show_repository',
        },
        {
            title: 'Material',
            href: route('equipments.materials', equipment.id),
            icon: null,
            permission: 'show_equipment',
        },
    ];

    const filteredSidebarNavItems: NavItem[] = sidebarNavItems.filter((item) => {
        if (item.title == 'Inspection') {
            if (equipment.status?.code === 'INST') {
                return item;
            }
        } else {
            return item;
        }
    });

    return (
        <AssetLayout sidebarNavItems={filteredSidebarNavItems} className={className}>
            {children}
        </AssetLayout>
    );
}
