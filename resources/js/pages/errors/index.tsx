import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ErrorPage({ status, title, description }: { status: number; title: string; description: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                <h1 className="text-muted-foreground/20 text-8xl font-extrabold tracking-tight">{status}</h1>

                <div className="mt-4 flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-2xl">{title}</h2>
                    <p className="text-muted-foreground max-w-xl">{description}</p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft />
                        Back
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
