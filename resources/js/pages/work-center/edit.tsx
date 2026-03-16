import WorkCenterForm, { WorkCenterFormData } from '@/components/forms/work-center-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { WorkCenter, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Work Centers',
        href: route('work-centers.index'),
    },
    {
        title: 'Edit',
        href: route('work-centers.index'),
    },
];

interface WorkCenterEditProps {
    workCenter: {
        data: WorkCenter;
    };
}

export default function WorkCenterEdit({ workCenter }: WorkCenterEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<WorkCenterFormData>>({
        code: workCenter.data.code,
        name: workCenter.data.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('work-centers.update', workCenter.data.id), {
            preserveScroll: true,
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
                    canSubmit={can.update_workcenter}
                    buttonLabel="Update"
                    className="max-w-xl"
                />
            </OrganizationsLayout>
        </AppLayout>
    );
}
