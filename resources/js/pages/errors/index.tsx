import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { KeySquare, LayoutGrid } from 'lucide-react';

export default function ErrorPage({ status, title, description }: { status: number; title: string; description: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: '#',
        },
    ];

    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

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
                    <Link
                        href={user ? route('dashboard') : route('login')}
                        className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        {user ? (
                            <>
                                <LayoutGrid />
                                Dashboard
                            </>
                        ) : (
                            <>
                                <KeySquare />
                                Login
                            </>
                        )}
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
