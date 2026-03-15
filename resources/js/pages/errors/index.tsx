import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { KeySquare, LayoutGrid, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export default function ErrorPage({ status, title, description }: { status: number; title: string; description: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: '#',
        },
    ];

    const { auth } = usePage<SharedData>().props;
    const user: User | undefined = auth?.user;
    const [processing, setProcessing] = useState<boolean>(false);

    const handleActionButton = () => {
        router.get(
            user ? route('dashboard') : route('login'),
            {},
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

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
                    <Button onClick={handleActionButton} disabled={processing}>
                        {user ? (
                            <>
                                {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LayoutGrid />}
                                Dashboard
                            </>
                        ) : (
                            <>
                                {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeySquare />}
                                Login
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
