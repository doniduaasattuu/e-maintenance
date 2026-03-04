import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Building2, DatabaseIcon, FolderOpen, Layers, LayoutGrid, ScanQrCodeIcon, TextSearch, Users2 } from 'lucide-react';
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
                title: 'Functional Location',
                href: route('functional-locations.index'),
                permission: 'index_functionallocation',
            },
            {
                title: 'Equipment',
                href: route('equipments.index'),
                permission: 'index_equipment',
            },
            {
                title: 'Material',
                href: route('materials.index'),
                permission: 'index_material',
            },
        ],
    },
    {
        title: 'Reference Data',
        href: '#',
        icon: Layers,
        subItems: [
            {
                title: 'Equipment History',
                href: route('equipment-histories.index'),
                permission: 'index_installdismantlehistory',
            },
            {
                title: 'Equipment Class',
                href: route('equipment-classes.index'),
                permission: 'index_equipmentclass',
            },
            {
                title: 'Equipment Status',
                href: route('equipment-statuses.index'),
                permission: 'index_equipmentstatus',
            },
            {
                title: 'Material Unit',
                href: route('units.index'),
                permission: 'index_unit',
            },
            {
                title: 'Material Type',
                href: route('material-types.index'),
                permission: 'index_materialtype',
            },
            {
                title: 'Finding Clause',
                href: route('finding-clauses.index'),
                permission: 'index_findingclause',
            },
            {
                title: 'Finding Status',
                href: route('finding-statuses.index'),
                permission: 'index_findingstatus',
            },
            {
                title: 'Finding Priority',
                href: route('finding-priorities.index'),
                permission: 'index_findingpriority',
            },
        ],
    },
    {
        title: 'Finding',
        href: route('findings.index'),
        icon: TextSearch,
        permission: 'index_finding',
    },
    {
        title: 'Repository',
        href: route('repositories.index'),
        icon: FolderOpen,
        permission: 'index_repository',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'User',
        href: route('users.index'),
        icon: Users2,
        permission: 'index_user',
    },
    {
        title: 'Role',
        href: route('roles.index'),
        icon: BadgeCheck,
        permission: 'index_role',
    },
    {
        title: 'Organization',
        href: route('departments.index'),
        icon: Building2,
        permission: 'index_department',
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
