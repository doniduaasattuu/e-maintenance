import InspectionMotorForm, { InspectionMotorData } from '@/components/forms/inspection-motor-form';
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

export default function InspectionMotorCreate({ equipment }: Props) {
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
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inspectionmotors.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'is_operational',
                    'is_clean',
                    'number_of_greasing',
                    'temperature_de',
                    'temperature_body',
                    'temperature_nde',
                    'vibration_dev',
                    'vibration_deh',
                    'vibration_dea',
                    'vibration_def',
                    'is_noisy_de',
                    'vibration_ndev',
                    'vibration_ndeh',
                    'vibration_ndef',
                    'is_noisy_nde',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title={equipment.data.code} description="Form inspection for equipment motor" className="max-w-2xl">
                <InspectionMotorForm
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
