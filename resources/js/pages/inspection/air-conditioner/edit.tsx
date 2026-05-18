import InspectionAirConditionerForm, { InspectionAirConditionerData } from '@/components/forms/inspection-air-conditioner-form';
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
    InspectionAirConditioner,
    WorkCenter,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionAirConditioner: {
        data: InspectionAirConditioner;
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

export default function InspectionAirConditionerEdit({
    inspectionAirConditioner,
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

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionAirConditionerData>>({
        equipment_id: equipment.data.id,
        is_operational: inspectionAirConditioner.data.is_operational.toString(),
        is_drain_leaking: inspectionAirConditioner.data.is_drain_leaking.toString(),
        current_load: inspectionAirConditioner.data.current_load ?? '',
        blowing_temperature: inspectionAirConditioner.data.blowing_temperature ?? '',
        ambient_temperature: inspectionAirConditioner.data.ambient_temperature ?? '',
        is_filter_clean: inspectionAirConditioner.data.is_filter_clean.toString(),
        is_evaporator_clean: inspectionAirConditioner.data.is_evaporator_clean.toString(),
        is_condensor_clean: inspectionAirConditioner.data.is_condensor_clean.toString(),
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
            route('inspectionairconditioners.update', {
                equipment: equipment.data.id,
                inspectionAirConditioner: inspectionAirConditioner.data.id,
            }),
            {
                preserveScroll: true,
            },
        );
    };

    const equipmentClassName = equipment.data.eclass?.name.toLocaleLowerCase();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <EquipmentLayout equipment={equipment.data} className="max-w-xl space-y-6">
                <Head title="Inspection" />
                <HeadingSmall
                    title={`${equipmentClassName ? equipmentClassName.toUpperCase() : 'Inspection'}`}
                    description="Equipment inspection update form."
                />
                <InspectionAirConditionerForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    setData={setData}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                    canSubmit={can.update_inspection && can.update_inspectionairconditioner}
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
