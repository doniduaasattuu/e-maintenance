import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Building2, BuildingIcon, DatabaseIcon, File, LayoutGrid, ScanQrCodeIcon, Users2 } from 'lucide-react';
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
                title: 'Functional location',
                href: '/functional-locations',
            },
            {
                title: 'Equipment',
                href: '/equipments',
            },
            {
                title: 'Material',
                href: '/materials',
            },
        ],
    },
    {
        title: 'Department',
        href: '#',
        icon: BuildingIcon,
        subItems: [
            {
                title: 'Report',
                href: '/reports',
            },
            {
                title: 'Finding',
                href: '/findings',
            },
        ],
    },
    {
        title: 'Repositories',
        href: '/repositories',
        icon: File,
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
