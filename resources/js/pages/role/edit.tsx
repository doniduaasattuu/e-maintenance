import RoleForm, { RoleFormData } from '@/components/forms/role-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, Role } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: route('roles.index'),
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface RoleEditProps {
    availablePermissions: string[];
    role: {
        data: Role;
    };
    currentPermissions: string[];
}

export default function RoleEdit({ availablePermissions, role, currentPermissions }: RoleEditProps) {
    const can = usePermissions();
    const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>(currentPermissions);
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<Required<RoleFormData>>({
        name: role.data.name,
        selectedPermissions: selectedPermissions,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('roles.update', role.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="ROLE" mode="edit">
                <RoleForm
                    availablePermissions={availablePermissions}
                    buttonLabel="Update"
                    canSubmit={can.update_role && selectedPermissions.length > 0}
                    data={data}
                    errors={errors}
                    processing={processing}
                    selectedPermissions={selectedPermissions}
                    setSelectedPermissions={setSelectedPermissions}
                    setData={setData}
                    submit={submit}
                    recentlySuccessful={recentlySuccessful}
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
