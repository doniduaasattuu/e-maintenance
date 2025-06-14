import DivisionForm, { DivisionFormData } from '@/components/forms/division-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { BreadcrumbItem, Division } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Division',
        href: '/organizations/divisions',
    },
    {
        title: 'Edit',
        href: '/organizations/divisions/{id}/edit',
    },
];

interface DivisionEditProps {
    division: {
        data: Division;
    };
}

export default function DivisionEdit({ division }: DivisionEditProps) {
    const can = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<DivisionFormData>>({
        code: division.data.code,
        name: division.data.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('divisions.update', division.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Division" />

            <OrganizationsLayout>
                <div className="max-w-2xl space-y-4">
                    <DivisionForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                        canSubmit={can.update_division}
                        buttonLabel="Update"
                    />
                </div>
            </OrganizationsLayout>
        </AppLayout>
    );
}
