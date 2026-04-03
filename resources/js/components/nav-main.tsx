import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import usePermissions from '@/hooks/use-permissions';
import { removeOrigin } from '@/lib/utils';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { can } = usePermissions();
    const { notifications } = usePage<SharedData>().props;
    const auditOpen = notifications.findings.audit_open;
    const abnormalityOpen = notifications.findings.abnormality_open;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item: NavItem) =>
                    item.subItems ? (
                        <Collapsible
                            key={item.title}
                            className="group/collapsible"
                            defaultOpen={item.subItems?.some((subItem) => window.location.pathname.startsWith(removeOrigin(subItem.href)))}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        {item.icon && <item.icon />}
                                        {item.title}
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    {
                                        <SidebarMenuSub>
                                            {item.subItems.map((subItem) => {
                                                const shouldRender = !subItem.permission || can[subItem.permission] == true;
                                                const isActive =
                                                    window.location.pathname == removeOrigin(subItem.href) ||
                                                    window.location.pathname.startsWith(removeOrigin(subItem.href));
                                                const finding = removeOrigin(subItem.href).replace('/', '');

                                                return shouldRender ? (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isActive}
                                                            className={`${isActive ? 'font-medium' : undefined}`}
                                                        >
                                                            <Link prefetch href={subItem.href}>
                                                                {finding == 'audits' && auditOpen > 0 ? (
                                                                    <>
                                                                        {subItem.title}
                                                                        <Badge variant={'destructive'} className="h-5 w-2 text-[12px]">
                                                                            {auditOpen}
                                                                        </Badge>{' '}
                                                                    </>
                                                                ) : finding == 'abnormalities' && abnormalityOpen > 0 ? (
                                                                    <>
                                                                        {subItem.title}
                                                                        <Badge variant={'destructive'} className="h-5 w-2 text-[12px]">
                                                                            {abnormalityOpen}
                                                                        </Badge>{' '}
                                                                    </>
                                                                ) : (
                                                                    <>{subItem.title}</>
                                                                )}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ) : null;
                                            })}
                                        </SidebarMenuSub>
                                    }
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : !item.permission || can[item.permission] == true ? (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={
                                    removeOrigin(item.href) == window.location.pathname ||
                                    window.location.pathname.startsWith(removeOrigin(item.href))
                                }
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ) : null,
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
