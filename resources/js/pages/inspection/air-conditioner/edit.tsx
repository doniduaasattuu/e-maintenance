import InspectionAirConditionerForm, { InspectionAirConditionerData } from '@/components/forms/inspection-air-conditioner-form';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, Equipment, InspectionAirConditioner } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionAirConditioner: {
        data: InspectionAirConditioner;
    };
    equipment: {
        data: Equipment;
    };
}

export default function InspectionAirConditionerEdit({ inspectionAirConditioner, equipment }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: inspectionAirConditioner.data.inspectionForm.equipment.code,
            href: `/equipments/${inspectionAirConditioner.data.inspectionForm.equipment.id}`,
        },
        {
            title: 'Inspection',
            href: `/inspections/airconditioner/${inspectionAirConditioner.data.inspectionForm.equipment?.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionAirConditionerData>>({
        equipment_id: inspectionAirConditioner.data.inspectionForm.equipment.id,
        is_operational: inspectionAirConditioner.data.is_operational.toString(),
        is_drain_leaking: inspectionAirConditioner.data.is_drain_leaking.toString(),
        current_load: inspectionAirConditioner.data.current_load ?? '',
        blowing_temperature: inspectionAirConditioner.data.blowing_temperature ?? '',
        ambient_temperature: inspectionAirConditioner.data.ambient_temperature ?? '',
        is_filter_clean: inspectionAirConditioner.data.is_filter_clean.toString(),
        is_evaporator_clean: inspectionAirConditioner.data.is_evaporator_clean.toString(),
        is_condensor_clean: inspectionAirConditioner.data.is_condensor_clean.toString(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('inspectionairconditioners.update', inspectionAirConditioner.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title={equipment.data.code} description="Inspection edit form for equipment air conditioner" className="max-w-2xl">
                <InspectionAirConditionerForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    setData={setData}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                />
            </TableLayout>
        </AppLayout>
    );
}
