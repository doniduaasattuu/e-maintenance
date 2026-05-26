import HeadingSmall from '@/components/heading-small';
import AssetLayout from '@/layouts/asset/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { Finding, type NavItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    finding: Finding;
    className?: string;
    children: React.ReactNode | undefined;
    type: 'ABN' | 'AUD';
    mode: 'create' | 'edit' | 'show';
    moduleKey: keyof typeof UI_STRINGS;
}

export default function FindingEditLayout({ finding, className, children, type, mode, moduleKey }: Props) {
    let sidebarNavItems: NavItem[] = [];

    switch (type) {
        case 'ABN':
            sidebarNavItems = [
                {
                    title: 'Data',
                    href: route('abnormalities.edit', finding.id),
                    icon: null,
                },
                {
                    title: 'Photo',
                    href: route('abnormalities.images.edit', finding.id),
                    icon: null,
                },
            ];
            break;
        case 'AUD':
            sidebarNavItems = [
                {
                    title: 'Data',
                    href: route('audits.edit', finding.id),
                    icon: null,
                },
                {
                    title: 'Photo',
                    href: route('audits.images.edit', finding.id),
                    icon: null,
                },
            ];
            break;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const strings = UI_STRINGS[moduleKey] as any;
    const content = mode === 'edit' ? strings.edit : mode === 'create' ? strings.create : strings.show;

    return (
        <AssetLayout sidebarNavItems={sidebarNavItems} className={className}>
            <Head title="Edit" />
            <HeadingSmall title={content.header ?? 'Edit'} description={content.description ?? 'Edit finding description and data.'} />
            {children}
        </AssetLayout>
    );
}
