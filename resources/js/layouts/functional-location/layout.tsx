import { FunctionalLocation, type NavItem } from '@/types';
import AssetLayout from '../asset/layout';

interface Props {
    functionalLocation: FunctionalLocation;
    className?: string;
    children: React.ReactNode | undefined;
}

export default function FunctionalLocationLayout({ functionalLocation, className, children }: Props) {
    const sidebarNavItems: NavItem[] = [
        {
            title: 'Details',
            href: route('functional-locations.show', functionalLocation.id),
            icon: null,
        },
        {
            title: 'Finding',
            href: route('functional-locations.findings', functionalLocation.id),
            icon: null,
            permission: 'show_finding',
        },
        {
            title: 'Image',
            href: route('images.functional-location.index', {
                id: functionalLocation.id,
                type: 'functional-location',
            }),
            icon: null,
            permission: 'show_image',
        },
    ];

    return (
        <AssetLayout sidebarNavItems={sidebarNavItems} className={className}>
            {children}
        </AssetLayout>
    );
}
