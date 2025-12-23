import InspectionMotorForm, { InspectionMotorData } from '@/components/forms/inspection-motor-form';
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

export default function InspectionMotorCreate({ equipment }: Props) {
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
            <Head title="Inspection" />

            <EquipmentLayout equipment={equipment.data}>
                <div className="space-y-6">
                    <HeadingSmall title="Inspection" description={`Equipment inspection form ${equipmentClassName}.`} />
                    <InspectionMotorForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                        canSubmit={can.store_inspection && can.store_inspectionmotor}
                    />
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
