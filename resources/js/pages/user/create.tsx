import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Department, Position, WorkCenter } from '@/types';
import { useForm } from '@inertiajs/react';

import UserForm, { UserFormData } from '@/components/forms/user-form';
import usePermissions from '@/hooks/use-permissions';
import FormLayout from '@/layouts/form/layout';
import React, { FormEventHandler, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index'),
    },
    {
        title: 'Create',
        href: route('users.create'),
    },
];

interface UserFormParams {
    departments: { data: Department[] };
    positions: { data: Position[] };
    workCenters: { data: WorkCenter[] };
    availableRoles: string[];
}

export default function UserCreate({ departments, positions, workCenters, availableRoles }: UserFormParams) {
    const { can } = usePermissions();
    const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<UserFormData>>({
        name: '',
        employee_id: '',
        email: '',
        phone_number: '',
        department_id: '',
        position_id: '',
        work_center_id: '',
        avatar: null,
        selectedRoles: [],
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'employee_id', 'email', 'phone_number', 'department_id', 'position_id', 'avatar', 'work_center_id', 'selectedRoles');
                setSelectedRoles([]);

                setData('department_id', '');
                setData('position_id', '');
                setData('work_center_id', '');

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="USER" mode="create">
                <UserForm
                    buttonLabel="Create"
                    canSubmit={can.store_user}
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
                    recentlySuccessful={recentlySuccessful}
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
