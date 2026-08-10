import ImprovementForm, { ImprovementFormData } from '@/components/forms/improvement-form';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Department, Equipment, FunctionalLocation, Improvement, ImprovementCategory, ImprovementStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT?.plural ?? 'Improvements',
        href: route('improvements.index'),
    },
    {
        title: 'Edit',
        href: route('improvements.index'),
    },
];

interface ImprovementEditProps {
    improvement: {
        data: Improvement;
    };
    departments: {
        data: Department[];
    };
    improvementCategories: {
        data: ImprovementCategory[];
    };
    improvementStatuses: {
        data: ImprovementStatus[];
    };
    selectedFunctionalLocation?: {
        data: FunctionalLocation | null;
    };
    selectedEquipment?: {
        data: Equipment | null;
    };
}

export default function ImprovementEdit({
    improvement,
    departments,
    improvementCategories,
    improvementStatuses,
    selectedFunctionalLocation,
    selectedEquipment,
}: ImprovementEditProps) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<ImprovementFormData>>({
        functional_location_id: improvement.data?.functional_location_id?.toString() ?? '',
        equipment_id: improvement.data?.equipment_id?.toString() ?? '',
        department_id: improvement.data?.department_id?.toString() ?? '',
        improvement_category_id: improvement.data?.improvement_category_id?.toString() ?? '',
        improvement_status_id: improvement.data?.improvement_status_id?.toString() ?? '',
        title: improvement.data?.title ?? '',
        problem: improvement.data?.problem ?? '',
        description: improvement.data?.description ?? '',
        root_cause: improvement.data?.root_cause ?? '',
        expected_benefit: improvement.data?.expected_benefit ?? '',
        actual_benefit: improvement.data?.actual_benefit ?? '',
        implementation_date: improvement.data?.implementation_date ?? '',
        remarks: improvement.data?.remarks ?? '',
        images_before: null,
        images_after: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('improvements.update', improvement.data.id), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="IMPROVEMENT" mode="edit">
                <ImprovementForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={improvement.data.can.update}
                    buttonLabel="Update"
                    departments={departments}
                    improvementCategories={improvementCategories}
                    improvementStatuses={improvementStatuses}
                    selectedFunctionalLocation={selectedFunctionalLocation?.data}
                    selectedEquipment={selectedEquipment?.data}
                    isEditing={true}
                />
            </FormLayout>
        </AppLayout>
    );
}
