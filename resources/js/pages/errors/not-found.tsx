import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function NotFound() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Not found',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Not found" />

            <div className="w-full px-4 py-6">
                <h1 className="flex">
                    <div className="align-center items-center">Back</div>
                </h1>
            </div>
        </AppLayout>
    );
}
