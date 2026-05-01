import HeadingSmall from '@/components/heading-small';
import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, Equipment, Finding, FindingClause, FindingPriority, FindingStatus, Meta, WorkCenter } from '@/types';
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
    findingClauses?: {
        data: FindingClause[];
    };
    findingPriorities?: {
        data: FindingPriority[];
    };
    findingStatuses?: {
        data: FindingStatus[];
    };
    departments?: {
        data: Department[];
    };
    workCenters?: {
        data: WorkCenter[];
    };
    causeCodes?: {
        data: CauseCode[];
    };
}

export default function EquipmentFindings({
    equipment,
    findings,
    filters,
    findingClauses,
    findingPriorities,
    findingStatuses,
    departments,
    workCenters,
    causeCodes,
}: EquipmentFindingsProps) {
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
                <TableFinding
                    asset={equipment.data}
                    mode="equipment"
                    withHeader={true}
                    findings={findings}
                    filters={filters}
                    findingClauses={findingClauses}
                    findingPriorities={findingPriorities}
                    findingStatuses={findingStatuses}
                    departments={departments}
                    workCenters={workCenters}
                    causeCodes={causeCodes}
                />
            </EquipmentLayout>
        </AppLayout>
    );
}
