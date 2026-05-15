import InspectionPanelForm, { InspectionPanelData } from '@/components/forms/inspection-panel-form';
import HeadingSmall from '@/components/heading-small';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import {
    BreadcrumbItem,
    CauseCode,
    Department,
    Equipment,
    FindingClause,
    FindingPriority,
    FindingStatus,
    InspectionPanel,
    WorkCenter,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionPanel: {
        data: InspectionPanel;
    };
    equipment: {
        data: Equipment;
    };
    findingClauses: {
        data: FindingClause[];
    };
    findingStatuses: {
        data: FindingStatus[];
    };
    findingPriorities: {
        data: FindingPriority[];
    };
    causeCodes: {
        data: CauseCode[];
    };
    departments: {
        data: Department[];
    };
    workCenters: {
        data: WorkCenter[];
    };
}

export default function InspectionPanelEdit({
    inspectionPanel,
    equipment,
    findingClauses,
    findingStatuses,
    findingPriorities,
    causeCodes,
    departments,
    workCenters,
}: Props) {
    const { can } = usePermissions();
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
            title: 'Inspection',
            href: '#',
        },
    ];

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionPanelData>>({
        equipment_id: equipment.data.id,
        is_operational: inspectionPanel.data.is_operational.toString(),
        is_clean: inspectionPanel.data.is_clean.toString(),
        temperature_incoming_r: inspectionPanel.data.temperature_incoming_r ?? '',
        temperature_incoming_s: inspectionPanel.data.temperature_incoming_s ?? '',
        temperature_incoming_t: inspectionPanel.data.temperature_incoming_t ?? '',
        temperature_cabinet: inspectionPanel.data.temperature_cabinet ?? '',
        temperature_outgoing_r: inspectionPanel.data.temperature_outgoing_r ?? '',
        temperature_outgoing_s: inspectionPanel.data.temperature_outgoing_s ?? '',
        temperature_outgoing_t: inspectionPanel.data.temperature_outgoing_t ?? '',
        current_r: inspectionPanel.data.current_r ?? '',
        current_s: inspectionPanel.data.current_s ?? '',
        current_t: inspectionPanel.data.current_t ?? '',
        has_abnormality: false,
        finding_clause_id: '',
        cause_code_id: '',
        description: '',
        department_id: '',
        work_center_id: '',
        finding_status_id: '1',
        finding_priority_id: '1',
        images: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(
            route('inspectionpanels.update', {
                equipment: equipment.data.id,
                inspectionPanel: inspectionPanel.data.id,
            }),
            {
                preserveScroll: true,
            },
        );
    };

    const equipmentClassName = equipment.data.eclass?.name.toLocaleLowerCase();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspection" />

            <EquipmentLayout equipment={equipment.data} className="max-w-xl space-y-6">
                <HeadingSmall
                    title={`${equipmentClassName ? equipmentClassName.toUpperCase() : 'Inspection'}`}
                    description="Equipment inspection update form."
                />
                <InspectionPanelForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                    canSubmit={can.update_inspection && can.update_inspectionpanel}
                    findingClauses={findingClauses}
                    findingStatuses={findingStatuses}
                    findingPriorities={findingPriorities}
                    causeCodes={causeCodes}
                    departments={departments}
                    workCenters={workCenters}
                />
            </EquipmentLayout>
        </AppLayout>
    );
}
