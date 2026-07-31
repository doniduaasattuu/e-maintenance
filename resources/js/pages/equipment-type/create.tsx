import EquipmentTypeForm, { EquipmentTypeFormData } from '@/components/forms/equipment-type-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, EquipmentClass } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT_TYPE?.plural ?? 'Equipment Types',
        href: route('equipment-types.index'),
    },
    {
        title: 'Create',
        href: route('equipment-types.create'),
    },
];

interface Props {
    equipmentClasses: {
        data: EquipmentClass[];
    };
}

export default function EquipmentTypeCreate({ equipmentClasses }: Props) {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<EquipmentTypeFormData>>({
        code: '',
        name: '',
        description: '',
        equipment_class_id: '',
        is_active: '1',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('equipment-types.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'name', 'description', 'equipment_class_id');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="EQUIPMENT_TYPE" mode="create">
                <EquipmentTypeForm
                    equipmentClasses={equipmentClasses}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_equipmentclass}
                    buttonLabel="Create"
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
