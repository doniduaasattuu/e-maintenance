import MaterialForm, { MaterialFormData } from '@/components/forms/material-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Material, MaterialType, Unit } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material',
        href: route('materials.index'),
    },
    {
        title: 'Edit',
        href: '/materials/edit',
    },
];

interface MaterialEditParams {
    material: { data: Material };
    units: { data: Unit[] };
    materialTypes: { data: MaterialType[] };
}

export default function MaterialEdit({ material, units, materialTypes }: MaterialEditParams) {
    const can = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<MaterialFormData>>({
        code: material.data.code,
        name: material.data.name,
        price: material.data.price.toString(),
        unit_id: material.data.unit_id?.toString() ?? '',
        material_type_id: material.data.material_type_id?.toString() ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('materials.update', material.data.id), {
            preserveScroll: true,
            // onSuccess: () => {
            //     reset('code', 'name', 'price', 'unit_id', 'material_type_id');
            // },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <MaterialForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_material}
                    buttonLabel="Update"
                    successMessage="Updated"
                    units={units.data}
                    materialTypes={materialTypes.data}
                />
            </div>
        </AppLayout>
    );
}
