import TableFindingStatus from '@/components/tables/table-finding-status';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, FindingStatus, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finding Statuses',
        href: route('finding-statuses.index'),
    },
];

interface FindingStatusProps {
    findingStatuses: {
        data: FindingStatus[];
        meta: Meta;
    };
}

export default function FindingStatusIndex({ findingStatuses }: FindingStatusProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableFindingStatus findingStatuses={findingStatuses} />
        </AppLayout>
    );
}
