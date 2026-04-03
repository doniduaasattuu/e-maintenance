import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, Finding, FindingClause, FindingPriority, FindingStatus, Meta } from '@/types';

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
    causeCodes: {
        data: CauseCode[];
    };
};

export default function FindingIndex({ findings, findingPriorities, findingStatuses, departments, findingClauses, causeCodes }: FindingProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableFinding
                findings={findings}
                findingClauses={findingClauses}
                findingPriorities={findingPriorities}
                findingStatuses={findingStatuses}
                departments={departments}
                causeCodes={causeCodes}
                moduleKey="AUDIT"
                endpoint="audits"
                clauseFilter="AUD"
            />
        </AppLayout>
    );
}
