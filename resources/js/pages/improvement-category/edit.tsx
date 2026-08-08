import ImprovementCategoryForm, { ImprovementCategoryFormData } from '@/components/forms/improvement-category-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, ImprovementCategory } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT_CATEGORY?.plural ?? 'Improvement Categories',
        href: route('improvement-categories.index'),
    },
    {
        title: 'Edit',
        href: route('improvement-categories.index'),
    },
];

interface ImprovementCategoryEditProps {
    improvementCategory: {
        data: ImprovementCategory;
    };
}

export default function ImprovementCategoryEdit({ improvementCategory }: ImprovementCategoryEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ImprovementCategoryFormData>>({
        name: improvementCategory.data.name,
        description: improvementCategory.data.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('improvement-categories.update', improvementCategory.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="IMPROVEMENT_CATEGORY" mode="edit">
                <ImprovementCategoryForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_equipmentclass}
                    buttonLabel="Update"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
