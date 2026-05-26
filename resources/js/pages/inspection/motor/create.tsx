import InspectionMotorForm, { InspectionMotorData } from '@/components/forms/inspection-motor-form';
import FoundAbnormalityCheckbox from '@/components/found-abnormality-checkbox';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, Equipment, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
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

export default function InspectionMotorCreate({
    equipment,
    findingClauses,
    findingStatuses,
    findingPriorities,
    causeCodes,
    departments,
    workCenters,
}: Props) {
    const { user, can } = usePermissions();
    const equipmentClassName = equipment.data.eclass?.name.toLocaleLowerCase();
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
            href: route('inspections.create', equipment.data.id),
        },
    ];

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<InspectionMotorData>>({
        equipment_id: equipment.data.id,
        is_operational: '1',
        is_clean: '1',
        number_of_greasing: 0,
        temperature_de: '',
        temperature_body: '',
        temperature_nde: '',
        vibration_dev: '',
        vibration_deh: '',
        vibration_dea: '',
        vibration_def: '',
        is_noisy_de: '0',
        vibration_ndev: '',
        vibration_ndeh: '',
        vibration_ndef: '',
        is_noisy_nde: '0',
        has_abnormality: false,
        finding_clause_id: '',
        cause_code_id: '',
        description: '',
        department_id: user.department_id ? user.department_id.toString() : '',
        work_center_id: user.work_center_id ? user.work_center_id.toString() : '',
        finding_status_id: '1',
        finding_priority_id: '1',
        images: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inspectionmotors.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Motor/Drive Inspection Form" />

            <EquipmentLayout equipment={equipment.data} className={data.has_abnormality ? 'w-full max-w-6xl' : 'w-full max-w-xl'}>
                <div className="space-y-6">
                    <FoundAbnormalityCheckbox
                        equipmentClassName={equipmentClassName}
                        hasAbnormality={data.has_abnormality}
                        onChecked={(checked) => setData('has_abnormality', checked)}
                    />
                    <InspectionMotorForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                        canSubmit={can.store_inspection && can.store_inspectionmotor}
                        findingClauses={findingClauses}
                        findingStatuses={findingStatuses}
                        findingPriorities={findingPriorities}
                        causeCodes={causeCodes}
                        departments={departments}
                        workCenters={workCenters}
                    />
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
