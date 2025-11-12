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
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { permissions } = usePage<SharedData>().props;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item: NavItem) =>
                    item.subItems ? (
                        <Collapsible
                            key={item.title}
                            className="group/collapsible"
                            defaultOpen={item.subItems?.some(
                                (subItem) =>
                                    window.location.href.includes(subItem.href) ||
                                    window.location.href.includes(subItem.href.replace(window.location.origin, '').slice(0, -1)),
                            )}
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
                                                const shouldRender = !subItem.permission || permissions[subItem.permission] == true;
                                                const endpoint = subItem.href.replace(window.location.origin, '');
                                                const isActive =
                                                    window.location.href.includes(endpoint) || window.location.href.includes(endpoint.slice(0, -1));

                                                return shouldRender ? (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isActive}
                                                            className={`${isActive ? 'font-medium' : undefined}`}
                                                        >
                                                            <Link prefetch href={subItem.href}>
                                                                {subItem.title}
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
                    ) : !item.permission || permissions[item.permission] == true ? (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.href === window.location.href} tooltip={{ children: item.title }}>
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
