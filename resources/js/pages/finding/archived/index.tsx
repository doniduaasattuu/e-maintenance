import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, Finding, FindingClause, FindingPriority, FindingStatus, Meta, WorkCenter } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.ARCHIVED_FINDING?.plural ?? 'Archived',
        href: route('findings.archived'),
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
    workCenters?: {
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

export default function ArchivedFindingIndex({
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
            <TableLayout isolated={true} moduleKey="ARCHIVED_FINDING" className="md:max-w-full">
                <TableFinding
                    mode="standalone"
                    isArchived={true}
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
