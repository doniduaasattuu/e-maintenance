import ImprovementForm, { ImprovementFormData } from '@/components/forms/improvement-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { formatDateString } from '@/lib/utils';
import { BreadcrumbItem, Department, ImprovementCategory, ImprovementStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT?.plural ?? 'Improvements',
        href: route('improvements.index'),
    },
    {
        title: 'Create',
        href: route('improvements.create'),
    },
];

interface Props {
    departments: {
        data: Department[];
    };
    improvementCategories: {
        data: ImprovementCategory[];
    };
    improvementStatuses: {
        data: ImprovementStatus[];
    };
    selectedDepartment?: string;
    selectedCategory?: string;
    selectedStatus?: string;
}

export default function ImprovementsCreate({
    departments,
    improvementCategories,
    improvementStatuses,
    selectedDepartment,
    selectedCategory,
    selectedStatus,
}: Props) {
    const { can } = usePermissions();
    const now = formatDateString();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<ImprovementFormData>({
        functional_location_id: '',
        equipment_id: '',
        department_id: selectedDepartment ?? '',
        improvement_category_id: selectedCategory ?? '',
        improvement_status_id: selectedStatus ?? '',
        title: '',
        problem: '',
        description: '',
        root_cause: '',
        expected_benefit: '',
        actual_benefit: '',
        implementation_date: now,
        remarks: '',
        images_before: null,
        images_after: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('improvements.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'functional_location_id',
                    'equipment_id',
                    'department_id',
                    'improvement_category_id',
                    'improvement_status_id',
                    'title',
                    'problem',
                    'description',
                    'root_cause',
                    'expected_benefit',
                    'actual_benefit',
                    'implementation_date',
                    'remarks',
                    'images_before',
                    'images_after',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="IMPROVEMENT" mode="create">
                <ImprovementForm
                    departments={departments}
                    improvementCategories={improvementCategories}
                    improvementStatuses={improvementStatuses}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_improvement}
                    buttonLabel="Create"
                    successMessage="Created"
                    // className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
