import HeadingSmall from '@/components/heading-small';
import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
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
    filters: {
        query: string;
        per_page: string;
    };
}

export default function EquipmentFindings({ equipment, findings, filters }: EquipmentFindingsProps) {
    const strings = UI_STRINGS;
    const auditTitle = strings.FINDING?.label ?? 'Finding';
    const abnormalityTitle = strings.ABNORMALITY?.label ?? 'Abnormality';
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
            <Head title="Finding" />

            <EquipmentLayout equipment={equipment.data} className="w-full space-y-4">
                <HeadingSmall title={abnormalityTitle + ' & ' + auditTitle} description="Historical records of abnormalities and audit results." />
                <TableFinding withHeader={false} findings={findings} filters={filters} mode="equipment" />
            </EquipmentLayout>
        </AppLayout>
    );
}
