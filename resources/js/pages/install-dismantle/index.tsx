import TableHistory from '@/components/tables/table-history';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, InstallDismantleHistory, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipment Histories',
        href: route('equipment-histories.index'),
    },
];

interface InstallDismantleHistoryProps {
    histories: {
        data: InstallDismantleHistory[];
        meta: Meta;
    };
}

export default function InstallDismantleHistoryIndex({ histories }: InstallDismantleHistoryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout
                title="Equipment History"
                description="Installation and dismantle history for equipments, including status and functional location changes"
                className="md:max-w-7xl"
            >
                <TableHistory histories={histories} />
            </TableLayout>
        </AppLayout>
    );
}
