// resources/js/Pages/Errors/NotFound.jsx

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
        // <div className="mt-20 text-center">
        //     <h1 className="text-6xl font-bold text-red-500">404</h1>
        //     <p className="mt-4 text-xl">Halaman tidak ditemukan.</p>

        //     <Head title="Not found" />

        //     <Link href="/dashboard" className="mt-4 block text-blue-500 underline">
        //         Kembali ke Dashboard
        //     </Link>
        // </div>
    );
}
