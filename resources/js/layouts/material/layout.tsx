import { Material, type NavItem } from '@/types';
import AssetLayout from '../asset/layout';

interface Props {
    material: Material;
    width?: string;
    children: React.ReactNode | undefined;
}

export default function MaterialLayout({ material, width, children }: Props) {
    const sidebarNavItems: NavItem[] = [
        {
            title: 'Details',
            href: route('materials.show', material.id), // http://127.0.0.1:8000/materials/1
            icon: null,
        },
        {
            title: 'Image',
            href: route('images.index', ['material', material.id]),
            icon: null,
            permission: 'show_image',
        },
    ];

    return (
        <AssetLayout width={width} sidebarNavItems={sidebarNavItems}>
            {children}
        </AssetLayout>
    );
}
