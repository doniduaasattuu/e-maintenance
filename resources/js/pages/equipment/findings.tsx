import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import FindingTable from '@/layouts/equipment/relation/finding';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, Finding, Meta } from '@/types';
import { Head } from '@inertiajs/react';

interface EquipmentFindingsProps {
    equipment: {
        data: Equipment;
    };
    findings: {
        data: Finding[];
        meta: Meta;
    };
}

export default function EquipmentFindings({ equipment, findings }: EquipmentFindingsProps) {
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
            title: 'Findings',
            href: route('equipments.show', equipment.data.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Findings" />

            <EquipmentLayout equipment={equipment.data} className="w-full max-w-6xl">
                <FindingTable findings={findings} />
            </EquipmentLayout>
        </AppLayout>
    );
}
