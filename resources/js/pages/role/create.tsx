import RoleForm, { RoleFormData } from '@/components/forms/role-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: route('roles.index'),
    },
    {
        title: 'Create',
        href: route('roles.create'),
    },
];

interface RoleCreateProps {
    availablePermissions: string[];
}

export default function RoleCreate({ availablePermissions }: RoleCreateProps) {
    const can = usePermissions();
    const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<RoleFormData>>({
        name: '',
        selectedPermissions: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('roles.store'), {
            onSuccess: () => {
                reset('name', 'selectedPermissions');
                setSelectedPermissions([]);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <RoleForm
                availablePermissions={availablePermissions}
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
            />
        </AppLayout>
    );
}
