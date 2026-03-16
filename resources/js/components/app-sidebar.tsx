import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { UI_STRINGS } from '@/lib/ui-strings';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Building2, DatabaseIcon, FolderOpen, Layers, LayoutGrid, ScanQrCodeIcon, TextSearch, Users2 } from 'lucide-react';
import AppLogo from './app-logo';

const strings = UI_STRINGS;
const mainNavItems: NavItem[] = [
    {
        title: strings.DASHBOARD?.label ?? 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: strings.QR_SCANNER?.label ?? 'QR Scanner',
        href: route('qr-scanner'),
        icon: ScanQrCodeIcon,
    },
    {
        title: 'Master Data',
        href: '#',
        icon: DatabaseIcon,
        subItems: [
            {
                title: strings.FUNCTIONAL_LOCATION?.label ?? 'Functional Location',
                href: route('functional-locations.index'),
                permission: 'index_functionallocation',
            },
            {
                title: strings.EQUIPMENT?.label ?? 'Equipment',
                href: route('equipments.index'),
                permission: 'index_equipment',
            },
            {
                title: strings.MATERIAL?.label ?? 'Material',
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
                title: strings.EQUIPMENT_HISTORY?.label ?? 'Equipment History',
                href: route('equipment-histories.index'),
                permission: 'index_installdismantlehistory',
            },
            {
                title: strings.EQUIPMENT_CLASS?.label ?? 'Equipment Class',
                href: route('equipment-classes.index'),
                permission: 'index_equipmentclass',
            },
            {
                title: strings.EQUIPMENT_STATUS?.label ?? 'Equipment Status',
                href: route('equipment-statuses.index'),
                permission: 'index_equipmentstatus',
            },
            {
                title: strings.MATERIAL_UNIT?.label ?? 'Material Unit',
                href: route('material-units.index'),
                permission: 'index_materialunit',
            },
            {
                title: strings.MATERIAL_TYPE?.label ?? 'Material Type',
                href: route('material-types.index'),
                permission: 'index_materialtype',
            },
            {
                title: strings.FINDING_CLAUSE?.label ?? 'Finding Clause',
                href: route('finding-clauses.index'),
                permission: 'index_findingclause',
            },
            {
                title: strings.FINDING_STATUS?.label ?? 'Finding Status',
                href: route('finding-statuses.index'),
                permission: 'index_findingstatus',
            },
            {
                title: strings.FINDING_PRIORITY?.label ?? 'Finding Priority',
                href: route('finding-priorities.index'),
                permission: 'index_findingpriority',
            },
        ],
    },
    {
        title: strings.FINDING?.label ?? 'Finding',
        href: route('findings.index'),
        icon: TextSearch,
        permission: 'index_finding',
    },
    {
        title: strings.REPOSITORY?.label ?? 'Repository',
        href: route('repositories.index'),
        icon: FolderOpen,
        permission: 'index_repository',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: strings.USER?.label ?? 'User',
        href: route('users.index'),
        icon: Users2,
        permission: 'index_user',
    },
    {
        title: strings.ROLE?.label ?? 'Role',
        href: route('roles.index'),
        icon: BadgeCheck,
        permission: 'index_role',
    },
    {
        title: strings.ORGANIZATION?.label ?? 'Organization',
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
