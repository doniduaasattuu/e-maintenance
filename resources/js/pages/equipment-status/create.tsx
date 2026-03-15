import EquipmentStatusForm, { EquipmentStatusFormData } from '@/components/forms/equipment-status-form';
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
        title: strings.EQUIPMENT_STATUS?.plural ?? 'Equipment Statuses',
        href: route('equipment-statuses.index'),
    },
    {
        title: 'Create',
        href: route('equipment-statuses.create'),
    },
];

export default function EquipmentStatusCreate() {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<EquipmentStatusFormData>>({
        code: '',
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('equipment-statuses.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'name', 'description');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="EQUIPMENT_STATUS" mode="create">
                <EquipmentStatusForm
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
