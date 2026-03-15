import TableFindingStatus from '@/components/tables/table-finding-status';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FindingStatus, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FINDING_STATUS?.plural ?? 'Finding Statuses',
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
