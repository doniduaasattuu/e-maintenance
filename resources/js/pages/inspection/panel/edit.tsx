import InspectionPanelForm, { InspectionPanelData } from '@/components/forms/inspection-panel-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, Equipment, InspectionPanel } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionPanel: {
        data: InspectionPanel;
    };
    equipment: {
        data: Equipment;
    };
}

export default function InspectionPanelEdit({ inspectionPanel, equipment }: Props) {
    const can = usePermissions();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: route('equipments.index'),
        },
        {
            title: inspectionPanel.data.inspectionForm.equipment.code,
            href: route('equipments.show', inspectionPanel.data.inspectionForm.equipment.id),
        },
        {
            title: 'Inspection',
            href: route('inspectionpanels.edit', inspectionPanel.data.inspectionForm.equipment?.id),
        },
    ];

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionPanelData>>({
        equipment_id: inspectionPanel.data.inspectionForm.equipment.id,
        is_operational: inspectionPanel.data.is_operational.toString(),
        is_clean: inspectionPanel.data.is_clean.toString(),
        temperature_incoming_r: inspectionPanel.data.temperature_incoming_r ?? '',
        temperature_incoming_s: inspectionPanel.data.temperature_incoming_s ?? '',
        temperature_incoming_t: inspectionPanel.data.temperature_incoming_t ?? '',
        temperature_cabinet: inspectionPanel.data.temperature_cabinet ?? '',
        temperature_outgoing_r: inspectionPanel.data.temperature_outgoing_r ?? '',
        temperature_outgoing_s: inspectionPanel.data.temperature_outgoing_s ?? '',
        temperature_outgoing_t: inspectionPanel.data.temperature_outgoing_t ?? '',
        current_r: inspectionPanel.data.current_r ?? '',
        current_s: inspectionPanel.data.current_s ?? '',
        current_t: inspectionPanel.data.current_t ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('inspectionpanels.update', inspectionPanel.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title={equipment.data.code} description="Inspection edit form for equipment panel" className="max-w-2xl">
                <InspectionPanelForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                    canSubmit={can.update_inspection && can.update_inspectionpanel}
                />
            </TableLayout>
        </AppLayout>
    );
}
