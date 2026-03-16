import TableRepository from '@/components/tables/table-repository';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Meta, Repository } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.REPOSITORY?.plural ?? 'Repositories',
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
