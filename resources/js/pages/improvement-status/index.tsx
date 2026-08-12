import TableImprovementStatus from '@/components/tables/table-improvement-status';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, ImprovementStatus, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT_STATUS?.plural ?? 'Improvement Statuses',
        href: route('improvement-statuses.index'),
    },
];

interface ImprovementStatusProps {
    improvementStatuses: {
        data: ImprovementStatus[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function ImprovementStatusIndex({ improvementStatuses, filters }: ImprovementStatusProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'IMPROVEMENT_STATUS'} className="md:max-w-7xl">
                <TableImprovementStatus improvementStatuses={improvementStatuses} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
