import TableRepository from '@/components/tables/table-repository';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
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
            <TableLayout moduleKey={'REPOSITORY'} className="md:max-w-7xl">
                <TableRepository repositories={repositories} extensions={extensions} renderable={renderable} />
            </TableLayout>
        </AppLayout>
    );
}
