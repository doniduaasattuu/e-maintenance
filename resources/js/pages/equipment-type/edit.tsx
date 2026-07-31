import EquipmentTypeForm, { EquipmentTypeFormData } from '@/components/forms/equipment-type-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, EquipmentClass, EquipmentType } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT_TYPE?.plural ?? 'Equipment Types',
        href: route('equipment-types.index'),
    },
    {
        title: 'Edit',
        href: route('equipment-types.index'),
    },
];

interface EquipmentTypeEditProps {
    equipmentType: {
        data: EquipmentType;
    };
    equipmentClasses: {
        data: EquipmentClass[];
    };
}

export default function EquipmentTypeEdit({ equipmentType, equipmentClasses }: EquipmentTypeEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<EquipmentTypeFormData>>({
        code: equipmentType.data.code,
        name: equipmentType.data.name,
        description: equipmentType.data?.description ?? '',
        equipment_class_id: equipmentType.data.equipment_class_id?.toString() ?? '',
        is_active: equipmentType.data.is_active ? '1' : '0',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('equipment-types.update', equipmentType.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="EQUIPMENT_TYPE" mode="edit">
                <EquipmentTypeForm
                    equipmentClasses={equipmentClasses}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_equipmentclass}
                    buttonLabel="Update"
                    isEditing={true}
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
