// resources/js/Pages/Errors/NotFound.jsx

import { Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <div className="mt-20 text-center">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="mt-4 text-xl">Halaman tidak ditemukan.</p>

            <Link href="/dashboard" className="mt-4 block text-blue-500 underline">
                Kembali ke Dashboard
            </Link>
        </div>
    );
}
