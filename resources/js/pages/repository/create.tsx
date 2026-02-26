import RepositoryForm, { RepositoryFormData } from '@/components/forms/repository-form';
import Heading from '@/components/heading';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Repositories',
        href: route('repositories.index'),
    },
    {
        title: 'Create',
        href: route('repositories.create'),
    },
];

export default function RepositoryCreate() {
    const can = usePermissions();
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<RepositoryFormData>>({
        title: '',
        file: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('repositories.store'), {
            onError: (e) => {
                console.log(e);
            },
            onSuccess: () => {
                reset('title');

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload" />

            <div className="max-w-2xl space-y-6 px-4 py-6">
                <Heading title="Upload" description="Upload file that can be download by everyone" />

                <RepositoryForm
                    buttonLabel="Upload"
                    canSubmit={can.store_repository}
                    data={data}
                    setData={setData}
                    fileInputRef={fileInputRef}
                    errors={errors}
                    processing={processing}
                    submit={submit}
                    recentlySuccessful={recentlySuccessful}
                    successMessage="Uploaded"
                    className="max-w-xl"
                />
            </div>
        </AppLayout>
    );
}
