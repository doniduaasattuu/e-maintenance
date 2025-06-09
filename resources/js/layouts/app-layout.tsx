import { Toaster } from '@/components/ui/sonner';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { cfl } from '@/lib/utils';
import { SharedData, type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
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
                action: message.action && {
                    label: message.action.label,
                    onClick: () => {
                        const { url, method } = message.action!;

                        switch (method.toLowerCase()) {
                            case 'get':
                                router.get(url);
                                break;
                            case 'post':
                                router.post(url);
                                break;
                            case 'put':
                                router.put(url);
                                break;
                            case 'delete':
                                router.delete(url);
                                break;
                            default:
                                console.warn('Unsupported method:', method);
                        }
                    },
                },
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
