import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { removeOrigin } from '@/lib/utils';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const page = usePage();
    const { permissions } = usePage<SharedData>().props;

    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupLabel>Utility</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const shouldRender = !item.permission || permissions[item.permission] === true;
                        return shouldRender ? (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    isActive={
                                        window.location.pathname == removeOrigin(item.href) ||
                                        window.location.pathname.startsWith(removeOrigin(item.href))
                                    }
                                    asChild
                                    className={`${page.url.includes(item.href) ? 'hover:text-neutral-800 dark:hover:text-neutral-100' : 'text-neutral-600 dark:text-neutral-300'}`}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ) : null;
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
