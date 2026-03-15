import TableFindingClause from '@/components/tables/table-finding-clause';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FindingClause, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FINDING_CLAUSE?.plural ?? 'Finding Clauses',
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
