import RepositoryForm, { RepositoryFormData } from '@/components/forms/repository-form';
import HeadingSmall from '@/components/heading-small';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import RepositoryLayout from '@/layouts/repository/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Repository } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.REPOSITORY?.plural ?? 'Repositories',
        href: route('repositories.index'),
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface RepositoryProps {
    repository: {
        data: Repository;
    };
}

export default function RepositoryEdit({ repository }: RepositoryProps) {
    const { can } = usePermissions();
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
            <Head title="Edit" />

            <RepositoryLayout repository={repository.data} className="w-full max-w-xl">
                <HeadingSmall title="Edit" description="Update repository data and information." />
                <RepositoryForm
                    buttonLabel="Update"
                    canSubmit={can.update_repository}
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
            </RepositoryLayout>
        </AppLayout>
    );
}
