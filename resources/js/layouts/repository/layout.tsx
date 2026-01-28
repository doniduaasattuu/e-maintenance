import { Repository, type NavItem } from '@/types';
import AssetLayout from '../asset/layout';

interface Props {
    repository: Repository;
    className?: string;
    children: React.ReactNode | undefined;
}

export default function RepositoryLayout({ repository, className, children }: Props) {
    const sidebarNavItems: NavItem[] = [
        {
            title: 'Edit',
            href: route('repositories.edit', repository.id),
            icon: null,
        },
        {
            title: 'Relation',
            href: route('repositories.relation', repository.id),
            icon: null,
        },
    ];

    return (
        <AssetLayout sidebarNavItems={sidebarNavItems} className={className}>
            <div className="flex h-full flex-1 flex-col space-y-4 rounded-xl">{children}</div>
        </AssetLayout>
    );
}
