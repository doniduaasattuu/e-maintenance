import InspectionTransformerForm, { InspectionTransformerData } from '@/components/forms/inspection-transformer-form';
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

export default function InspectionTransformerCreate({
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
            href: '#',
        },
    ];

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<InspectionTransformerData>>({
        equipment_id: equipment.data.id,
        is_operational: '1',
        is_clean: '1',
        primary_current_r: '',
        primary_current_s: '',
        primary_current_t: '',
        primary_voltage_r: '',
        primary_voltage_s: '',
        primary_voltage_t: '',
        secondary_current_r: '',
        secondary_current_s: '',
        secondary_current_t: '',
        secondary_voltage_r: '',
        secondary_voltage_s: '',
        secondary_voltage_t: '',
        temperature_oil: '',
        temperature_winding: '',
        desicant_level_id: '1',
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
        post(route('inspectiontransformers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspection" />

            <EquipmentLayout equipment={equipment.data} className={data.has_abnormality ? 'w-full max-w-6xl' : 'w-full max-w-xl'}>
                <div className="space-y-6">
                    <FoundAbnormalityCheckbox
                        equipmentClassName={equipmentClassName}
                        hasAbnormality={data.has_abnormality}
                        onChecked={(checked) => setData('has_abnormality', checked)}
                    />
                    <InspectionTransformerForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                        canSubmit={can.store_inspection && can.store_inspectiontransformer}
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
