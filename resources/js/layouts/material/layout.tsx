import { Material, type NavItem } from '@/types';
import AssetLayout from '../asset/layout';

interface Props {
    material: Material;
    children: React.ReactNode | undefined;
    className?: string;
}

export default function MaterialLayout({ material, children, className }: Props) {
    const sidebarNavItems: NavItem[] = [
        {
            title: 'Details',
            href: route('materials.show', material.id), // http://127.0.0.1:8000/materials/1
            icon: null,
        },
        {
            title: 'Images',
            href: route('images.material.index', {
                id: material.id,
                type: 'material',
            }),
            icon: null,
            permission: 'show_image',
        },
        {
            title: 'Repositories',
            href: route('materials.repositories', material.id),
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
