import InspectionTransformerForm, { InspectionTransformerData } from '@/components/forms/inspection-transformer-form';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, InspectionTransformer } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionTransformer: {
        data: InspectionTransformer;
    };
}

export default function InspectionTransformerEdit({ inspectionTransformer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: inspectionTransformer.data.inspectionForm.equipment.code,
            href: `/equipments/${inspectionTransformer.data.inspectionForm.equipment.id}`,
        },
        {
            title: 'Inspection',
            href: `/inspections/transformer/${inspectionTransformer.data.inspectionForm.equipment?.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionTransformerData>>({
        equipment_id: inspectionTransformer.data.inspectionForm.equipment.id,
        is_operational: inspectionTransformer.data.is_operational.toString(),
        is_clean: inspectionTransformer.data.is_clean.toString(),
        primary_current_r: inspectionTransformer.data.primary_current_r ?? '',
        primary_current_s: inspectionTransformer.data.primary_current_s ?? '',
        primary_current_t: inspectionTransformer.data.primary_current_t ?? '',
        primary_voltage_r: inspectionTransformer.data.primary_voltage_r ?? '',
        primary_voltage_s: inspectionTransformer.data.primary_voltage_s ?? '',
        primary_voltage_t: inspectionTransformer.data.primary_voltage_t ?? '',
        secondary_current_r: inspectionTransformer.data.secondary_current_r ?? '',
        secondary_current_s: inspectionTransformer.data.secondary_current_s ?? '',
        secondary_current_t: inspectionTransformer.data.secondary_current_t ?? '',
        secondary_voltage_r: inspectionTransformer.data.secondary_voltage_r ?? '',
        secondary_voltage_s: inspectionTransformer.data.secondary_voltage_s ?? '',
        secondary_voltage_t: inspectionTransformer.data.secondary_voltage_t ?? '',
        temperature_oil: inspectionTransformer.data.temperature_oil?.toString() ?? '',
        temperature_winding: inspectionTransformer.data.temperature_winding?.toString() ?? '',
        desicant_level_id: inspectionTransformer.data.desicant_level_id?.toString() ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('inspectiontransformers.update', inspectionTransformer.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title="Inspection Form" description="Inspection edit form for equipment transformer" className="max-w-2xl">
                <InspectionTransformerForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                />
            </TableLayout>
        </AppLayout>
    );
}
