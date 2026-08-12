import ImprovementCategoryForm, { ImprovementCategoryFormData } from '@/components/forms/improvement-category-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT_CATEGORY?.plural ?? 'Improvement Categories',
        href: route('improvement-categories.index'),
    },
    {
        title: 'Create',
        href: route('improvement-categories.create'),
    },
];

export default function ImprovementCategoryCreate() {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<ImprovementCategoryFormData>>({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('improvement-categories.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'description');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="IMPROVEMENT_CATEGORY" mode="create">
                <ImprovementCategoryForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_improvementcategory}
                    buttonLabel="Create"
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
