import FindingClauseForm, { FindingClauseFormData } from '@/components/forms/finding-clause-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FindingClause } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FINDING_CLAUSE?.plural ?? 'Finding Clauses',
        href: route('finding-clauses.index'),
    },
    {
        title: 'Edit',
        href: route('finding-clauses.index'),
    },
];

interface FindingClauseEditProps {
    findingClause: {
        data: FindingClause;
    };
}

export default function FindingClauseEdit({ findingClause }: FindingClauseEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<FindingClauseFormData>>({
        code: findingClause.data.code,
        title: findingClause.data.title,
        description: findingClause.data.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('finding-clauses.update', findingClause.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="FINDING_CLAUSE" mode="edit">
                <FindingClauseForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_findingclause}
                    buttonLabel="Update"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
