import InspectionMotorForm, { InspectionMotorData } from '@/components/forms/inspection-motor-form';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, Equipment, InspectionMotor } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    inspectionMotor: {
        data: InspectionMotor;
    };
    equipment: {
        data: Equipment;
    };
}

export default function InspectionMotorEdit({ inspectionMotor, equipment }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: inspectionMotor.data.inspectionForm.equipment.code,
            href: `/equipments/${inspectionMotor.data.inspectionForm.equipment.id}`,
        },
        {
            title: 'Inspection',
            href: `/inspections/motor/${inspectionMotor.data.inspectionForm.equipment?.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<InspectionMotorData>>({
        equipment_id: inspectionMotor.data.inspectionForm.equipment.id,
        is_operational: inspectionMotor.data.is_operational.toString(),
        is_clean: inspectionMotor.data.is_clean.toString(),
        number_of_greasing: inspectionMotor.data.number_of_greasing,
        temperature_de: inspectionMotor.data.temperature_de ?? '',
        temperature_body: inspectionMotor.data.temperature_body ?? '',
        temperature_nde: inspectionMotor.data.temperature_nde ?? '',
        vibration_dev: inspectionMotor.data.vibration_dev ?? '',
        vibration_deh: inspectionMotor.data.vibration_deh ?? '',
        vibration_dea: inspectionMotor.data.vibration_dea ?? '',
        vibration_def: inspectionMotor.data.vibration_def ?? '',
        is_noisy_de: inspectionMotor.data.is_noisy_de.toString(),
        vibration_ndev: inspectionMotor.data.vibration_ndev ?? '',
        vibration_ndeh: inspectionMotor.data.vibration_ndeh ?? '',
        vibration_ndef: inspectionMotor.data.vibration_ndef ?? '',
        is_noisy_nde: inspectionMotor.data.is_noisy_nde.toString(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('inspectionmotors.update', inspectionMotor.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title={equipment.data.code} description="Inspection edit form for equipment motor" className="max-w-2xl">
                <InspectionMotorForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    setData={setData}
                    submit={submit}
                    showSuccessMessage={true}
                    isEditing={true}
                />
            </TableLayout>
        </AppLayout>
    );
}
