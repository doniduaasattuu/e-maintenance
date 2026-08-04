import PermissionForm, { PermissionFormData } from '@/components/forms/permission-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Permission } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.PERMISSION?.plural ?? 'Permissions',
        href: route('permissions.index'),
    },
    {
        title: 'Edit',
        href: route('permissions.index'),
    },
];

interface Props {
    permission: {
        data: Permission;
    };
}

export default function PermissionCreate({ permission }: Props) {
    const { can } = usePermissions();
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm<Required<PermissionFormData>>({
        name: permission.data.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('permissions.update', permission.data.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="PERMISSION" mode="edit">
                <PermissionForm
                    buttonLabel="Update"
                    canSubmit={can.update_permission}
                    data={data}
                    errors={errors}
                    processing={processing}
                    setData={setData}
                    submit={submit}
                    recentlySuccessful={recentlySuccessful}
                    successMessage="Updated"
                    className="max-w-xl"
                    editing={true}
                />
            </FormLayout>
        </AppLayout>
    );
}
