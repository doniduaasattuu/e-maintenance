import TableRepository from '@/components/tables/table-repository';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meta, Repository } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: route('repositories.index'),
    },
];

type RepositoryIndexProps = {
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    extensions?: string[];
};
export default function RoleIndex({ repositories, extensions }: RepositoryIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableRepository repositories={repositories} extensions={extensions} />
        </AppLayout>
    );
}
