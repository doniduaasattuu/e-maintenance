import InspectionTransformerForm, { InspectionTransformerData } from '@/components/forms/inspection-transformer-form';
import HeadingSmall from '@/components/heading-small';
import usePermissions from '@/hooks/use-permissions';
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

export default function InspectionTransformerCreate({ equipment }: Props) {
    const can = usePermissions();
    const equipmentClassName = equipment.data.equipmentClass?.name.toLocaleLowerCase();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
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
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inspectiontransformers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'is_operational',
                    'is_clean',
                    'primary_current_r',
                    'primary_current_s',
                    'primary_current_t',
                    'primary_voltage_r',
                    'primary_voltage_s',
                    'primary_voltage_t',
                    'secondary_current_r',
                    'secondary_current_s',
                    'secondary_current_t',
                    'secondary_voltage_r',
                    'secondary_voltage_s',
                    'secondary_voltage_t',
                    'temperature_oil',
                    'temperature_winding',
                    'desicant_level_id',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspection" />

            <EquipmentLayout equipment={equipment.data} className="max-w-xl">
                <div className="space-y-6">
                    <HeadingSmall title="Inspection" description={`Equipment inspection form ${equipmentClassName}.`} />
                    <InspectionTransformerForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                        canSubmit={can.store_inspection && can.store_inspectiontransformer}
                    />
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
