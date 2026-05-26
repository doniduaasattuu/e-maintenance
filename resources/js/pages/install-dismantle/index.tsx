import TableHistory from '@/components/tables/table-history';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, InstallDismantleHistory, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT_HISTORY?.plural ?? 'Equipment Histories',
        href: route('equipment-histories.index'),
    },
];

interface InstallDismantleHistoryProps {
    histories: {
        data: InstallDismantleHistory[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function InstallDismantleHistoryIndex({ histories, filters }: InstallDismantleHistoryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'EQUIPMENT_HISTORY'} className="md:max-w-7xl">
                <TableHistory histories={histories} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
