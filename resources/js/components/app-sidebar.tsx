import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Building2, BuildingIcon, DatabaseIcon, File, Layers, LayoutGrid, ScanQrCodeIcon, Users2 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'QR Scanner',
        href: route('qr-scanner'),
        icon: ScanQrCodeIcon,
    },
    {
        title: 'Master Data',
        href: '#',
        icon: DatabaseIcon,
        subItems: [
            {
                title: 'Functional locations',
                href: route('functional-locations.index'),
                permission: 'read_functionallocation',
            },
            {
                title: 'Equipments',
                href: route('equipments.index'),
                permission: 'read_equipment',
            },
            {
                title: 'Materials',
                href: route('materials.index'),
                permission: 'read_material',
            },
        ],
    },
    {
        title: 'Reference Data',
        href: '#',
        icon: Layers,
        subItems: [
            {
                title: 'Equipment histories',
                href: route('equipment-histories.index'),
                permission: 'read_installdismantlehistory',
            },
            {
                title: 'Equipment classes',
                href: route('equipment-classes.index'),
                permission: 'read_equipmentclass',
            },
            {
                title: 'Equipment statuses',
                href: route('equipment-statuses.index'),
                permission: 'read_equipmentstatus',
            },
            {
                title: 'Material unit',
                href: route('units.index'),
                permission: 'read_unit',
            },
            {
                title: 'Material type',
                href: route('material-types.index'),
                permission: 'read_materialtype',
            },
        ],
    },
    {
        title: 'Department',
        href: '#',
        icon: BuildingIcon,
        subItems: [
            {
                title: 'Reports',
                href: '/reports',
                permission: 'read_report',
            },
            {
                title: 'Findings',
                href: '/findings',
                permission: 'read_finding',
            },
        ],
    },
    {
        title: 'Repositories',
        href: '/repositories',
        icon: File,
        permission: 'read_repository',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Users',
        href: route('users.index'),
        icon: Users2,
        permission: 'read_user',
    },
    {
        title: 'Roles',
        href: route('roles.index'),
        icon: BadgeCheck,
        permission: 'read_role',
    },
    {
        title: 'Organizations',
        href: route('departments.index'),
        icon: Building2,
        permission: 'read_department',
        children: [route('departments.index'), route('divisions.index'), route('work-centers.index')],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
