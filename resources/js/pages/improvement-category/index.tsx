import TableImprovementCategory from '@/components/tables/table-improvement-category';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, ImprovementCategory, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT_CATEGORY?.plural ?? 'Improvement Categories',
        href: route('improvement-categories.index'),
    },
];

interface ImprovementCategoryProps {
    improvementCategories: {
        data: ImprovementCategory[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function ImprovementCategoryIndex({ improvementCategories, filters }: ImprovementCategoryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'IMPROVEMENT_CATEGORY'} className="md:max-w-7xl">
                <TableImprovementCategory improvementCategories={improvementCategories} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
