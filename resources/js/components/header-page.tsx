/* eslint-disable @typescript-eslint/no-explicit-any */
// resources/js/Components/HeaderPage.tsx
import { UI_STRINGS } from '@/lib/ui-strings';

interface HeaderPageProps {
    moduleKey: keyof typeof UI_STRINGS;
    mode: 'create' | 'edit';
    identifier?: string; // Untuk menampilkan ID seperti EMO000992
}

export default function HeaderPage({ moduleKey, mode, identifier }: HeaderPageProps) {
    // Pastikan kita tidak mengambil key ACTIONS atau key lain yang bukan modul
    const module = UI_STRINGS[moduleKey] as any;
    const content = mode === 'edit' ? module.edit : module.create;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">
                {content.header}
                {mode === 'edit' && identifier && <span className="ml-2 font-mono text-gray-400">[{identifier}]</span>}
            </h1>
            <p className="mt-2 text-sm text-gray-600">{content.description}</p>
        </div>
    );
}
