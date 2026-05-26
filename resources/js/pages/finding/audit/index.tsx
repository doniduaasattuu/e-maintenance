import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, Finding, FindingClause, FindingPriority, FindingStatus, Meta, WorkCenter } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.AUDIT?.plural ?? 'Audits',
        href: route('audits.index'),
    },
];

type FindingProps = {
    findings: {
        data: Finding[];
        meta: Meta;
    };
    findingClauses: {
        data: FindingClause[];
    };
    findingStatuses: {
        data: FindingStatus[];
    };
    findingPriorities: {
        data: FindingPriority[];
    };
    departments: {
        data: Department[];
    };
    workCenters: {
        data: WorkCenter[];
    };
    causeCodes: {
        data: CauseCode[];
    };
    filters: {
        query: string;
        per_page: string;
    };
};

export default function FindingIndex({
    findings,
    findingPriorities,
    findingStatuses,
    departments,
    workCenters,
    findingClauses,
    causeCodes,
    filters,
}: FindingProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout isolated={true} moduleKey="AUDIT" className="md:max-w-full">
                <TableFinding
                    mode="standalone"
                    findingTypeCode="AUD"
                    filters={filters}
                    findings={findings}
                    findingClauses={findingClauses}
                    findingPriorities={findingPriorities}
                    findingStatuses={findingStatuses}
                    departments={departments}
                    workCenters={workCenters}
                    causeCodes={causeCodes}
                />
            </TableLayout>
        </AppLayout>
    );
}
