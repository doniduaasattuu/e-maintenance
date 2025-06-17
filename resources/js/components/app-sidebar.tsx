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
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'QR Scanner',
        href: '/qr-scanner',
        icon: ScanQrCodeIcon,
    },
    {
        title: 'Master Data',
        href: '#',
        icon: DatabaseIcon,
        subItems: [
            {
                title: 'Functional locations',
                href: '/functional-locations',
                permission: 'read_functionallocation',
            },
            {
                title: 'Equipments',
                href: '/equipments',
                permission: 'read_equipments',
            },
            {
                title: 'Materials',
                href: '/materials',
                permission: 'read_materials',
            },
        ],
    },
    {
        title: 'Reference Data',
        href: '#',
        icon: Layers,
        subItems: [
            {
                title: 'Equipment classes',
                href: '/equipment-classes',
                permission: 'read_equipmentclass',
            },
            {
                title: 'Equipment statuses',
                href: '/equipment-statuses',
                permission: 'read_equipmentstatus',
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
        href: '/users',
        icon: Users2,
        permission: 'read_user',
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: BadgeCheck,
        permission: 'read_role',
    },
    {
        title: 'Organizations',
        href: '/organizations/departments',
        icon: Building2,
        permission: 'read_department',
        children: ['/organizations/departments', '/organizations/divisions', '/organizations/work-centers'],
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
