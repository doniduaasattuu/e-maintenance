import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Finding, FindingPriority, FindingStatus, Meta } from '@/types';

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
    findingStatuses: {
        data: FindingStatus[];
    };
    findingPriorities: {
        data: FindingPriority[];
    };
};

export default function FindingIndex({ findings, findingPriorities, findingStatuses }: FindingProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableFinding findings={findings} findingPriorities={findingPriorities} findingStatuses={findingStatuses} />
        </AppLayout>
    );
}
