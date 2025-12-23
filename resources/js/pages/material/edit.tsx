import MaterialForm, { MaterialFormData } from '@/components/forms/material-form';
import HeadingSmall from '@/components/heading-small';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import MaterialLayout from '@/layouts/material/layout';
import { BreadcrumbItem, Material, MaterialType, Unit } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface MaterialEditParams {
    material: { data: Material };
    units: { data: Unit[] };
    materialTypes: { data: MaterialType[] };
}

export default function MaterialEdit({ material, units, materialTypes }: MaterialEditParams) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Material',
            href: route('materials.index'),
        },
        {
            title: material.data.code,
            href: route('materials.show', material.data.id),
        },
        {
            title: 'Edit',
            href: route('materials.edit', material.data.id),
        },
    ];

    const can = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<MaterialFormData>>({
        code: material.data.code,
        name: material.data.name,
        price: material.data.price?.toString(),
        unit_id: material.data.unit_id?.toString() ?? '',
        material_type_id: material.data.material_type_id?.toString() ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('materials.update', material.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <MaterialLayout material={material.data}>
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Edit" description="Update equipment data and information." />
                        <Link className="text-foreground hover:text-muted-foreground text-sm" href={route('materials.show', material.data.id)}>
                            Back
                        </Link>
                    </div>
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
            </MaterialLayout>
        </AppLayout>
    );
}
