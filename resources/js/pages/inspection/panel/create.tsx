import InspectionPanelForm, { InspectionPanelData } from '@/components/forms/inspection-panel-form';
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

export default function InspectionPanelCreate({ equipment }: Props) {
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

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<InspectionPanelData>>({
        equipment_id: equipment.data.id,
        is_operational: '1',
        is_clean: '1',
        temperature_incoming_r: '',
        temperature_incoming_s: '',
        temperature_incoming_t: '',
        temperature_cabinet: '',
        temperature_outgoing_r: '',
        temperature_outgoing_s: '',
        temperature_outgoing_t: '',
        current_r: '',
        current_s: '',
        current_t: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('inspectionpanels.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'is_operational',
                    'is_clean',
                    'temperature_incoming_r',
                    'temperature_incoming_s',
                    'temperature_incoming_t',
                    'temperature_cabinet',
                    'temperature_outgoing_r',
                    'temperature_outgoing_s',
                    'temperature_outgoing_t',
                    'current_r',
                    'current_s',
                    'current_t',
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
                    <InspectionPanelForm
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
