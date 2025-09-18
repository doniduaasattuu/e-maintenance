import RoleForm, { RoleFormData } from '@/components/forms/role-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Edit',
        href: '/roles/edit',
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
            <RoleForm
                availablePermissions={availablePermissions}
                buttonLabel="Update"
                canSubmit={can.update_role || selectedPermissions.length > 1}
                data={data}
                errors={errors}
                processing={processing}
                selectedPermissions={selectedPermissions}
                setSelectedPermissions={setSelectedPermissions}
                setData={setData}
                submit={submit}
                recentlySuccessful={recentlySuccessful}
            />
        </AppLayout>
    );
}
