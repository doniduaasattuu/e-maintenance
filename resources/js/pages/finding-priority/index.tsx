import TableFindingPriority from '@/components/tables/table-finding-priority';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FindingPriority, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FINDING_PRIORITY?.plural ?? 'Finding Priorities',
        href: route('finding-priorities.index'),
    },
];

interface FindingPriorityProps {
    findingPriorities: {
        data: FindingPriority[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function FindingPriorityIndex({ findingPriorities, filters }: FindingPriorityProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'FINDING_PRIORITY'} className="md:max-w-7xl">
                <TableFindingPriority findingPriorities={findingPriorities} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
