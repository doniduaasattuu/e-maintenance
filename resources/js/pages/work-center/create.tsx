import WorkCenterForm, { WorkCenterFormData } from '@/components/forms/work-center-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Work Centers',
        href: route('work-centers.index'),
    },
    {
        title: 'Create',
        href: route('work-centers.create'),
    },
];

export default function WorkCenterCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<WorkCenterFormData>>({
        code: '',
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('work-centers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'code');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Work Centers" />

            <OrganizationsLayout>
                <WorkCenterForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_workcenter}
                    buttonLabel="Submit"
                    successMessage="Created"
                    className="max-w-xl"
                />
            </OrganizationsLayout>
        </AppLayout>
    );
}
