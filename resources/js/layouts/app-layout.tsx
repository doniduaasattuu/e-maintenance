import { Toaster } from '@/components/ui/sonner';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { cfl } from '@/lib/utils';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { type ReactNode } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { appearance } = useAppearance();
    const { message } = usePage<SharedData>().props;

    React.useEffect(() => {
        if (message) {
            toast[message.type](cfl(message?.type), {
                description: message?.description,
            });
        }
    }, [message]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster theme={appearance === 'light' ? 'light' : appearance} />
            {children}
        </AppLayoutTemplate>
    );
};
