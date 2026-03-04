import TableFindingClause from '@/components/tables/table-finding-clause';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, FindingClause, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finding Clauses',
        href: route('finding-clauses.index'),
    },
];

interface FindingClauseProps {
    findingClauses: {
        data: FindingClause[];
        meta: Meta;
    };
}

export default function FindingClauseIndex({ findingClauses }: FindingClauseProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableFindingClause findingClauses={findingClauses} />
        </AppLayout>
    );
}
