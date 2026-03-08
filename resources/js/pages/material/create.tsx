import MaterialForm, { MaterialFormData } from '@/components/forms/material-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, MaterialType, Unit } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material',
        href: route('materials.index'),
    },
    {
        title: 'Create',
        href: route('materials.create'),
    },
];

interface MaterialCreateParams {
    units: { data: Unit[] };
    materialTypes: { data: MaterialType[] };
}

export default function MaterialCreate({ units, materialTypes }: MaterialCreateParams) {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<MaterialFormData>>({
        code: '',
        name: '',
        price: '',
        unit_id: '',
        material_type_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('materials.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'name', 'price', 'unit_id', 'material_type_id');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="MATERIAL" mode="create">
                <MaterialForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_material}
                    buttonLabel="Submit"
                    successMessage="Created"
                    units={units.data}
                    materialTypes={materialTypes.data}
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
