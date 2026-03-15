import TableFindingPriority from '@/components/tables/table-finding-priority';
import AppLayout from '@/layouts/app-layout';
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
}

export default function FindingPriorityIndex({ findingPriorities }: FindingPriorityProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableFindingPriority findingPriorities={findingPriorities} />
        </AppLayout>
    );
}
