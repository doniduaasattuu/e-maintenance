import QrScanner from '@/components/qr-scanner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'QR Scanner',
        href: '/qr-scanner',
    },
];

export default function QRCodeIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="QR Scanner" />

            <QrScanner />
        </AppLayout>
    );
}
