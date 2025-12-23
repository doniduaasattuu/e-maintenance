import RepositoryForm, { RepositoryFormData } from '@/components/forms/repository-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Repository } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Repositories',
        href: route('repositories.index'),
    },
    {
        title: 'Edit',
        href: route('repositories.create'),
    },
];

interface RepositoryProps {
    repository: {
        data: Repository;
    };
}

export default function RepositoryEdit({ repository }: RepositoryProps) {
    const can = usePermissions();
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<RepositoryFormData>>({
        title: repository.data.title,
        file: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('repositories.update', repository.data.id), {
            onSuccess: () => {
                reset('file');

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <RepositoryForm
                buttonLabel="Update"
                canSubmit={can.create_repository}
                data={data}
                setData={setData}
                fileInputRef={fileInputRef}
                errors={errors}
                processing={processing}
                submit={submit}
                editing={true}
                recentlySuccessful={recentlySuccessful}
                successMessage="Updated"
            />
        </AppLayout>
    );
}
