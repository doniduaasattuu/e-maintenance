import CauseCodeForm, { CauseCodeFormData } from '@/components/forms/cause-code-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.CAUSE_CODE?.plural ?? 'Cause Codes',
        href: route('cause-codes.index'),
    },
    {
        title: 'Edit',
        href: route('cause-codes.index'),
    },
];

interface CauseCodeEditProps {
    causeCode: {
        data: CauseCode;
    };
}

export default function CauseCodeEdit({ causeCode }: CauseCodeEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<CauseCodeFormData>>({
        code: causeCode.data.code,
        description: causeCode.data.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('cause-codes.update', causeCode.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="CAUSE_CODE" mode="edit">
                <CauseCodeForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_causecode}
                    buttonLabel="Update"
                    className="max-w-xl"
                    isEditing={true}
                />
            </FormLayout>
        </AppLayout>
    );
}
