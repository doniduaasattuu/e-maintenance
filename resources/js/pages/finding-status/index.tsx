import TableFindingStatus from '@/components/tables/table-finding-status';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
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
    filters: {
        query: string;
        per_page: string;
    };
}

export default function FindingStatusIndex({ findingStatuses, filters }: FindingStatusProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'FINDING_STATUS'} className="md:max-w-7xl">
                <TableFindingStatus findingStatuses={findingStatuses} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
