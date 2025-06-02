import RoleForm, { RoleFormData } from '@/components/forms/role-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
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
    id: string;
    name: string;
    currentPermissions: string[];
}

export default function RoleEdit({ availablePermissions, id, name, currentPermissions }: RoleEditProps) {
    const can = usePermissions();
    const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>(currentPermissions);
    const { data, setData, patch, processing, errors } = useForm<Required<RoleFormData>>({
        name: name,
        selectedPermissions: selectedPermissions,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('roles.update', id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <RoleForm
                availablePermissions={availablePermissions}
                buttonLabel="Update role"
                canSubmit={can.update_role || selectedPermissions.length > 1}
                data={data}
                errors={errors}
                processing={processing}
                selectedPermissions={selectedPermissions}
                setSelectedPermissions={setSelectedPermissions}
                setData={setData}
                submit={submit}
            />
        </AppLayout>
    );
}
