import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, Finding, FindingClause, FindingPriority, FindingStatus, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.ABNORMALITY?.plural ?? 'Abnormalities',
        href: route('abnormalities.index'),
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
            <TableLayout moduleKey="ABNORMALITY" className="md:max-w-full">
                <TableFinding
                    findingTypeCode="ABN"
                    findings={findings}
                    findingClauses={findingClauses}
                    findingPriorities={findingPriorities}
                    findingStatuses={findingStatuses}
                    departments={departments}
                    causeCodes={causeCodes}
                    moduleKey="ABNORMALITY"
                    endpoint="abnormalities"
                    clauseFilter="ABN"
                />
            </TableLayout>
        </AppLayout>
    );
}
