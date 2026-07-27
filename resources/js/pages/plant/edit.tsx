import UnitForm, { PlantFormData } from '@/components/forms/plant-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Plant } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.PLANT?.plural ?? 'Plants',
        href: route('plants.index'),
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface PlantEditProps {
    plant: {
        data: Plant;
    };
}

export default function PlantEdit({ plant }: PlantEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<PlantFormData>>({
        name: plant.data.name,
        code: plant.data.code,
        sort_order: plant.data.sort_order?.toString(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('plants.update', plant.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="PLANT" mode="edit">
                <UnitForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_materialunit}
                    buttonLabel="Update"
                    successMessage="Updated"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
