import Tableimprovement from '@/components/tables/table-improvement';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Improvement, ImprovementCategory, ImprovementStatus, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT?.plural ?? 'Improvements',
        href: route('improvements.index'),
    },
];

interface ImprovementProps {
    improvements: {
        data: Improvement[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
    improvementCategories: {
        data: ImprovementCategory[];
    };
    improvementStatuses: {
        data: ImprovementStatus[];
    };
}

export default function ImprovementIndex({ improvements, filters, improvementCategories, improvementStatuses }: ImprovementProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'IMPROVEMENT'} className="md:max-w-full">
                <Tableimprovement
                    improvements={improvements}
                    filters={filters}
                    improvementCategories={improvementCategories}
                    improvementStatuses={improvementStatuses}
                />
            </TableLayout>
        </AppLayout>
    );
}
