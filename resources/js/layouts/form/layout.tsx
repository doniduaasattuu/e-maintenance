/* eslint-disable @typescript-eslint/no-explicit-any */
import HeadingSmall from '@/components/heading-small';
import { UI_STRINGS } from '@/lib/ui-strings';
import { cfl, cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';

interface FormLayoutProps {
    className?: string;
    children: React.ReactNode | undefined;
    moduleKey: keyof typeof UI_STRINGS;
    mode: 'create' | 'edit';
}

export default function FormLayout({ className, children, moduleKey, mode }: FormLayoutProps) {
    const strings = UI_STRINGS[moduleKey] as any;
    const content = mode === 'edit' ? strings.edit : strings.create;

    return (
        <div className={cn('flex h-full flex-1 flex-col space-y-6 rounded-xl p-4', className)}>
            <Head title={cfl(mode)} />
            <HeadingSmall title={content.header} description={content.description} />
            {children}
        </div>
    );
}
