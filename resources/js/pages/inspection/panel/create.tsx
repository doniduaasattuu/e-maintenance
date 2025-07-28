import InspectionPanelForm, { InspectionPanelData } from '@/components/forms/inspection-panel-form';
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

export default function InspectionPanelCreate({ equipment }: Props) {
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
            <TableLayout title="Inspection Form" description="Form inspection for equipment panel" className="max-w-2xl">
                <InspectionPanelForm
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
