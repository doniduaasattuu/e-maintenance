import InspectionMotorForm, { InspectionMotorData } from '@/components/forms/inspection-motor-form';
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
    InspectionMotor,
    WorkCenter,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionMotor: {
        data: InspectionMotor;
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

export default function InspectionMotorEdit({
    inspectionMotor,
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

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionMotorData>>({
        equipment_id: equipment.data.id,
        is_operational: inspectionMotor.data.is_operational.toString(),
        is_clean: inspectionMotor.data.is_clean.toString(),
        number_of_greasing: inspectionMotor.data.number_of_greasing,
        temperature_de: inspectionMotor.data.temperature_de ?? '',
        temperature_body: inspectionMotor.data.temperature_body ?? '',
        temperature_nde: inspectionMotor.data.temperature_nde ?? '',
        vibration_dev: inspectionMotor.data.vibration_dev ?? '',
        vibration_deh: inspectionMotor.data.vibration_deh ?? '',
        vibration_dea: inspectionMotor.data.vibration_dea ?? '',
        vibration_def: inspectionMotor.data.vibration_def ?? '',
        is_noisy_de: inspectionMotor.data.is_noisy_de.toString(),
        vibration_ndev: inspectionMotor.data.vibration_ndev ?? '',
        vibration_ndeh: inspectionMotor.data.vibration_ndeh ?? '',
        vibration_ndef: inspectionMotor.data.vibration_ndef ?? '',
        is_noisy_nde: inspectionMotor.data.is_noisy_nde.toString(),
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
            route('inspectionmotors.update', {
                equipment: equipment.data.id,
                inspectionMotor: inspectionMotor.data.id,
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
                <InspectionMotorForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    setData={setData}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                    canSubmit={can.update_inspection && can.update_inspectionmotor}
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
