import TableRepository from '@/components/tables/table-repository';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meta, Repository } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Repositories',
        href: route('repositories.index'),
    },
];

type RepositoryIndexProps = {
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    extensions?: string[];
    renderable: string[];
};
export default function RoleIndex({ repositories, extensions, renderable }: RepositoryIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableRepository repositories={repositories} extensions={extensions} renderable={renderable} />
        </AppLayout>
    );
}
