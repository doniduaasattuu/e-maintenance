import InspectionTransformerForm, { InspectionTransformerData } from '@/components/forms/inspection-transformer-form';
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
    InspectionTransformer,
    WorkCenter,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionTransformer: {
        data: InspectionTransformer;
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

export default function InspectionTransformerEdit({
    inspectionTransformer,
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

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionTransformerData>>({
        equipment_id: equipment.data.id,
        is_operational: inspectionTransformer.data.is_operational.toString(),
        is_clean: inspectionTransformer.data.is_clean.toString(),
        primary_current_r: inspectionTransformer.data.primary_current_r ?? '',
        primary_current_s: inspectionTransformer.data.primary_current_s ?? '',
        primary_current_t: inspectionTransformer.data.primary_current_t ?? '',
        primary_voltage_r: inspectionTransformer.data.primary_voltage_r ?? '',
        primary_voltage_s: inspectionTransformer.data.primary_voltage_s ?? '',
        primary_voltage_t: inspectionTransformer.data.primary_voltage_t ?? '',
        secondary_current_r: inspectionTransformer.data.secondary_current_r ?? '',
        secondary_current_s: inspectionTransformer.data.secondary_current_s ?? '',
        secondary_current_t: inspectionTransformer.data.secondary_current_t ?? '',
        secondary_voltage_r: inspectionTransformer.data.secondary_voltage_r ?? '',
        secondary_voltage_s: inspectionTransformer.data.secondary_voltage_s ?? '',
        secondary_voltage_t: inspectionTransformer.data.secondary_voltage_t ?? '',
        temperature_oil: inspectionTransformer.data.temperature_oil?.toString() ?? '',
        temperature_winding: inspectionTransformer.data.temperature_winding?.toString() ?? '',
        desicant_level_id: inspectionTransformer.data.desicant_level_id?.toString() ?? '',
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
            route('inspectiontransformers.update', {
                equipment: equipment.data.id,
                inspectionTransformer: inspectionTransformer.data.id,
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
                <InspectionTransformerForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                    canSubmit={can.update_inspection && can.update_inspectiontransformer}
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
