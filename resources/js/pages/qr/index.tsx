import QrScanner from '@/components/qr-scanner';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.QR_SCNANER?.plural ?? 'QR Scanner',
        href: route('qr-scanner'),
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
