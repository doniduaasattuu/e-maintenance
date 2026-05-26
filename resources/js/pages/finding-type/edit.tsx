import FindingTypeForm, { FindingTypeFormData } from '@/components/forms/finding-type-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FindingType } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FINDING_TYPE?.plural ?? 'Finding Types',
        href: route('finding-types.index'),
    },
    {
        title: 'Edit',
        href: route('finding-types.index'),
    },
];

interface FindingTypeEditProps {
    findingType: {
        data: FindingType;
    };
}

export default function FindingTypeEdit({ findingType }: FindingTypeEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<FindingTypeFormData>>({
        code: findingType.data.code,
        title: findingType.data.title,
        name: findingType.data.name,
        description: findingType.data.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('finding-types.update', findingType.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="FINDING_TYPE" mode="edit">
                <FindingTypeForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_findingtype}
                    buttonLabel="Update"
                    className="max-w-xl"
                    isEditing={true}
                />
            </FormLayout>
        </AppLayout>
    );
}
