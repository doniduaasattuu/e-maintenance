import InspectionTransformerForm, { InspectionTransformerData } from '@/components/forms/inspection-transformer-form';
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

export default function InspectionTransformerCreate({ equipment }: Props) {
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
            <TableLayout title="Inspection Form" description="Form inspection for equipment transformer" className="max-w-2xl">
                <InspectionTransformerForm
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
