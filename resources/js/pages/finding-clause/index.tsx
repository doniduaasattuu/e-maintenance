import TableFindingClause from '@/components/tables/table-finding-clause';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
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
    filters: {
        query: string;
        per_page: string;
    };
}

export default function FindingClauseIndex({ findingClauses, filters }: FindingClauseProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'FINDING_CLAUSE'} className="md:max-w-7xl">
                <TableFindingClause findingClauses={findingClauses} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
