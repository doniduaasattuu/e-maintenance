import TablePlant from '@/components/tables/table-plant';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { Meta, Plant, type BreadcrumbItem } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.PLANT?.plural ?? 'Plants',
        href: route('plants.index'),
    },
];

interface PlantIndexProps {
    plants: {
        data: Plant[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function PlantIndex({ plants, filters }: PlantIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'PLANT'} className="md:max-w-2xl">
                <TablePlant plants={plants} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
