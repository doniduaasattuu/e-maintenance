import TableMaterial from '@/components/tables/table-material';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, Material, Meta } from '@/types';
import { Head } from '@inertiajs/react';

interface EquipmentMaterialsProps {
    equipment: {
        data: Equipment;
    };
    materials: {
        data: Material[];
        meta: Meta;
    };
}

export default function EquipmentMaterials({ equipment, materials }: EquipmentMaterialsProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.EQUIPMENT?.plural ?? 'Equipments',
            href: route('equipments.index'),
        },
        {
            title: equipment.data.code,
            href: route('equipments.show', equipment.data.id),
        },
        {
            title: 'Materials',
            href: route('equipments.show', equipment.data.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materials" />

            <EquipmentLayout equipment={equipment.data} className="w-full max-w-7xl">
                <TableMaterial materialTypes={{ data: [] }} withHeader={false} materials={materials} materialUnits={{ data: [] }} />
            </EquipmentLayout>
        </AppLayout>
    );
}
