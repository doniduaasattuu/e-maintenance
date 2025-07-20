import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, Equipment } from '@/types';

interface Props {
    equipment: {
        data: Equipment;
    };
}

export default function InspectionTransformerCreate({ equipment }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: equipment.data.code,
            href: `/equipments/${equipment.data.id}`,
        },
        {
            title: 'Inspection',
            href: `/equipments/${equipment.data.id}/inspection`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title={equipment.data.code} description="Form inspection for equipment transformer">
                <h1>{`Hello ${equipment.data.code}`}</h1>
            </TableLayout>
        </AppLayout>
    );
}
