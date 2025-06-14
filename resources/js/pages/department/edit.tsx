import DepartmentForm, { DepartmentFormData } from '@/components/forms/department-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { BreadcrumbItem, Department, Division } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/organizations/departments',
    },
    {
        title: 'Edit',
        href: '/organizations/departments/{id}/edit',
    },
];

interface DepartmentEditProps {
    department: {
        data: Department;
    };
    divisions: {
        data: Division[];
    };
}

export default function DepartmentEdit({ department, divisions }: DepartmentEditProps) {
    const can = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<DepartmentFormData>>({
        code: department.data.code,
        name: department.data.name,
        division_id: String(department.data.division_id),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('departments.update', department.data.id), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department" />

            <OrganizationsLayout>
                <div className="max-w-2xl space-y-4">
                    <DepartmentForm
                        divisions={divisions}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                        canSubmit={can.update_department}
                        buttonLabel="Update"
                    />
                </div>
            </OrganizationsLayout>
        </AppLayout>
    );
}
