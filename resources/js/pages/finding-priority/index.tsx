import TableFindingPriority from '@/components/tables/table-finding-priority';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, FindingPriority, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finding Priorities',
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
