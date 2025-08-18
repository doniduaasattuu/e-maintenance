import InspectionAirConditionerForm, { InspectionAirConditionerData } from '@/components/forms/inspection-air-conditioner-form';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, Equipment } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    equipment: {
        data: Equipment;
    };
}

export default function InspectionAirConditionerCreate({ equipment }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: equipment.data.code,
            href: `/equipments/${equipment.data.id}`,
        },
        {
            title: 'Inspection',
            href: `/equipments/${equipment.data.id}/inspection`,
        },
    ];

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<InspectionAirConditionerData>>({
        equipment_id: equipment.data.id,
        is_operational: '1',
        is_drain_leaking: '0',
        current_load: '',
        blowing_temperature: '',
        ambient_temperature: '',
        is_filter_clean: '1',
        is_evaporator_clean: '1',
        is_condensor_clean: '1',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inspectionairconditioners.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'is_operational',
                    'is_evaporator_clean',
                    'current_load',
                    'blowing_temperature',
                    'ambient_temperature',
                    'is_filter_clean',
                    'is_evaporator_clean',
                    'is_condensor_clean',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title={equipment.data.code} description="Form inspection for equipment air conditioner" className="max-w-2xl">
                <InspectionAirConditionerForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                />
            </TableLayout>
        </AppLayout>
    );
}
