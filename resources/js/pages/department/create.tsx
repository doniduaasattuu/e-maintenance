import DepartmentForm, { DepartmentFormData } from '@/components/forms/department-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { BreadcrumbItem, Division } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/organizations/departments',
    },
    {
        title: 'Create',
        href: '/organizations/departments/create',
    },
];

interface DepartmentCreateProps {
    divisions: {
        data: Division[];
    };
}

export default function DepartmentCreate({ divisions }: DepartmentCreateProps) {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<DepartmentFormData>>({
        code: '',
        name: '',
        division_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('departments.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'code', 'division_id');
            },
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
                        canSubmit={can.create_department}
                        buttonLabel="Create"
                        successMessage="Created"
                    />
                </div>
            </OrganizationsLayout>
        </AppLayout>
    );
}
