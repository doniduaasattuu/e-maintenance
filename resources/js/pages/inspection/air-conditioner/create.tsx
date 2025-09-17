import InspectionAirConditionerForm, { InspectionAirConditionerData } from '@/components/forms/inspection-air-conditioner-form';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { BreadcrumbItem, Equipment } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    equipment: {
        data: Equipment;
    };
}

export default function InspectionAirConditionerCreate({ equipment }: Props) {
    const equipmentClassName = equipment.data.equipmentClass?.name.toLocaleLowerCase();
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
            <Head title="Inspection" />

            <EquipmentLayout equipment={equipment.data}>
                <div className="space-y-6">
                    <HeadingSmall title="Inspection" description={`Equipment inspection form ${equipmentClassName}.`} />
                    <InspectionAirConditionerForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                    />
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
