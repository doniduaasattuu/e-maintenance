import DivisionForm, { DivisionFormData } from '@/components/forms/division-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Division',
        href: '/organizations/divisions',
    },
    {
        title: 'Create',
        href: '/organizations/divisions/{id}/create',
    },
];

export default function DivisionCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<DivisionFormData>>({
        code: '',
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('divisions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'code');
            },
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
                        canSubmit={can.create_division}
                        buttonLabel="Submit"
                    />
                </div>
            </OrganizationsLayout>
        </AppLayout>
    );
}
