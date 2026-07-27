import PlantForm, { PlantFormData } from '@/components/forms/plant-form';
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
        title: strings.PLANT?.plural ?? 'Plants',
        href: route('plants.index'),
    },
    {
        title: 'Create',
        href: route('plants.create'),
    },
];

export default function PlantCreate() {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<PlantFormData>>({
        code: '',
        name: '',
        sort_order: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('plants.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code');
                reset('name');
                reset('sort_order');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="PLANT" mode="create">
                <PlantForm
                    buttonLabel="Create"
                    canSubmit={can.store_plant}
                    data={data}
                    errors={errors}
                    processing={processing}
                    setData={setData}
                    submit={submit}
                    recentlySuccessful={recentlySuccessful}
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
