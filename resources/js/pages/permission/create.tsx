import PermissionForm, { PermissionFormData } from '@/components/forms/permission-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.PERMISSION?.plural ?? 'Permissions',
        href: route('permissions.index'),
    },
    {
        title: 'Create',
        href: route('permissions.create'),
    },
];

export default function PermissionCreate() {
    const { can } = usePermissions();
    const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<PermissionFormData>>({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('permissions.store'), {
            onSuccess: () => {
                reset('name');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="PERMISSION" mode="create">
                <PermissionForm
                    buttonLabel="Create"
                    canSubmit={can.store_role}
                    data={data}
                    errors={errors}
                    processing={processing}
                    selectedPermissions={selectedPermissions}
                    setSelectedPermissions={setSelectedPermissions}
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
