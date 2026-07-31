import EquipmentForm, { EquipmentFormData, EquipmentFormProps } from '@/components/forms/equipment-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT?.plural ?? 'Equipments',
        href: route('equipments.index'),
    },
    {
        title: 'Create',
        href: route('equipments.create'),
    },
];

export default function EquipmentCreate({ equipmentClasses, equipmentStatuses, equipmentTypes }: EquipmentFormProps) {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<EquipmentFormData>>({
        code: '',
        sort_field: '',
        description: '',
        functional_location_id: '',
        equipment_class_id: '',
        equipment_type_id: '',
        equipment_status_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('equipments.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'code',
                    'sort_field',
                    'description',
                    'functional_location_id',
                    'equipment_class_id',
                    'equipment_type_id',
                    'equipment_status_id',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="EQUIPMENT" mode="create">
                <EquipmentForm
                    equipmentTypes={equipmentTypes}
                    equipmentClasses={equipmentClasses}
                    equipmentStatuses={equipmentStatuses}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_equipment}
                    funclocDismantleButton={true}
                    buttonLabel="Create"
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
