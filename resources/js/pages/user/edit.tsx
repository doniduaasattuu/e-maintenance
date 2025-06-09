import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Department, Position, User, WorkCenter } from '@/types';
import { useForm } from '@inertiajs/react';

import UserForm, { UserFormData } from '@/components/forms/user-form';
import usePermissions from '@/hooks/use-permissions';
import React, { FormEventHandler, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit',
        href: '/users/edit',
    },
];

interface UserFormParams {
    user: { data: User };
    userRoles: string[];
    departments: { data: Department[] };
    positions: { data: Position[] };
    workCenters: { data: WorkCenter[] };
    availableRoles: string[];
}

export default function UserEdit({ user, departments, positions, workCenters, availableRoles, userRoles }: UserFormParams) {
    const can = usePermissions();
    const [selectedRoles, setSelectedRoles] = React.useState<string[]>(userRoles ?? []);
    const { data, setData, post, processing, errors, reset } = useForm<Required<UserFormData>>({
        name: user.data.name,
        employee_id: user.data.employee_id,
        email: user.data.email,
        phone_number: user.data.phone_number ?? '',
        department_id: user.data.department_id?.toString() ?? '',
        position_id: user.data.position_id?.toString() ?? '',
        work_center_id: user.data.work_center_id?.toString() ?? '',
        avatar: null,
        selectedRoles: selectedRoles,
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.update', user.data.id), {
            // forceFormData: true,
            onSuccess: () => {
                reset('avatar');

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <UserForm
                buttonLabel="Update User"
                canSubmit={can.update_user}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                departments={departments}
                positions={positions}
                workCenters={workCenters}
                availableRoles={availableRoles}
                selectedRoles={selectedRoles}
                setSelectedRoles={setSelectedRoles}
                fileInputRef={fileInputRef}
                submit={submit}
            />
        </AppLayout>
    );
}
