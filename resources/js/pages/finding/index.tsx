import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Department, Finding, FindingClause, FindingPriority, FindingStatus, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Findings',
        href: route('findings.index'),
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
};

export default function FindingIndex({ findings, findingPriorities, findingStatuses, departments, findingClauses }: FindingProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableFinding
                findings={findings}
                findingClauses={findingClauses}
                findingPriorities={findingPriorities}
                findingStatuses={findingStatuses}
                departments={departments}
            />
        </AppLayout>
    );
}
