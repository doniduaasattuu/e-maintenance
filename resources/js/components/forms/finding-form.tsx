import { useImageCompressor } from '@/hooks/use-image-compressor';
import { cn } from '@/lib/utils';
import { CauseCode, Department, Equipment, FindingClause, FindingPriority, FindingStatus, FunctionalLocation, WorkCenter } from '@/types';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import ButtonSubmit from '../button-submit';
import CauseCodeSelect from '../cause-code-select';
import DepartmentSelect from '../department-select';
import EquipmentSelect from '../equipment-select';
import FindingClauseSelect from '../finding-clause-select';
import FindingDescriptionInput from '../finding-description-input';
import FindingPhotoInput from '../finding-photo-input';
import FindingPrioritySelect from '../finding-priority-select';
import FindingStatusSelect from '../finding-status-select';
import FunctionalLocationSelect from '../functional-location-select';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import WorkCenterSelect from '../work-center-select';

interface FindingFormProps {
    functionalLocation?: FunctionalLocation | null;
    equipment?: Equipment | null;
    data: Required<FindingFormData>;
    setData: <K extends keyof FindingFormData>(key: K, value: FindingFormData[K]) => void;
    errors: Partial<Record<keyof FindingFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
    findingClauses: {
        data: FindingClause[];
    };
    findingStatuses: {
        data: FindingStatus[];
    };
    findingPriorities: {
        data: FindingPriority[];
    };
    causeCodes: {
        data: CauseCode[];
    };
    departments: {
        data: Department[];
    };
    workCenters: {
        data: WorkCenter[];
    };
    isEditing?: boolean;
    closedStatusId?: string | number | null;
    type: string;
}

export type FindingFormData = {
    finding_clause_id: string;
    finding_status_id: string;
    finding_priority_id: string;
    cause_code_id: string;
    department_id: string;
    work_center_id: string;
    functional_location_id: string;
    equipment_id: string;
    description: string;
    notification: string;
    images?: File[] | null;
};

export default function FindingForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
    className,
    findingClauses,
    findingStatuses,
    findingPriorities,
    causeCodes,
    departments,
    workCenters,
    functionalLocation,
    equipment,
    isEditing = false,
    type,
}: FindingFormProps) {
    const compressImage = useImageCompressor();
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

    const disabledAudit =
        data.finding_clause_id == '' ||
        data.description == '' ||
        data.functional_location_id == '' ||
        data.finding_status_id == '' ||
        data.finding_priority_id == '';
    const disabledAbnormality = disabledAudit || data.cause_code_id == '' || data.department_id == '' || data.work_center_id == '';
    const disabledWhen = type == 'AUD' ? disabledAudit : disabledAbnormality;

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        setIsCompressing(true);

        try {
            const fileArray = Array.from(files);

            const compressionPromises = fileArray.map(async (file) => {
                return await compressImage(file);
            });

            const compressedFiles = await Promise.all(compressionPromises);

            setData('images', compressedFiles);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Compression failed: ', error);
            }
        } finally {
            setIsCompressing(false);
        }
    };

    findingClauses.data = findingClauses.data.filter((e: FindingClause) => {
        return e.type.toLowerCase() == type.toLowerCase();
    });

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            {type == 'ABN' ? (
                <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                    <FindingClauseSelect
                        clauses={findingClauses?.data}
                        value={data.finding_clause_id}
                        onChange={(val) => setData('finding_clause_id', val)}
                        error={errors.finding_clause_id}
                        tabIndex={1}
                        disabled={processing}
                    />
                    <CauseCodeSelect
                        causeCodes={causeCodes?.data}
                        value={data.cause_code_id}
                        onChange={(val) => setData('cause_code_id', val)}
                        error={errors.cause_code_id}
                        disabled={processing}
                    />
                </div>
            ) : (
                <FindingClauseSelect
                    clauses={findingClauses.data}
                    value={data.finding_clause_id}
                    onChange={(val) => setData('finding_clause_id', val)}
                    error={errors.finding_clause_id}
                    tabIndex={1}
                    disabled={processing}
                />
            )}

            <FindingDescriptionInput
                value={data.description}
                onChange={(val) => setData('description', val)}
                error={errors.description}
                tabIndex={3}
                placeholder={
                    type === 'ABN'
                        ? "Describe the machine abnormality (e.g., 'Unusual vibration on motor bearing...')"
                        : 'Describe the audit finding in detail...'
                }
                disabled={processing}
            />

            <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                <DepartmentSelect
                    departments={departments?.data}
                    value={data.department_id}
                    onChange={(val) => setData('department_id', val)}
                    error={errors.department_id}
                    tabIndex={4}
                    disabled={processing}
                    required={type === 'ABN'}
                />

                <WorkCenterSelect
                    workCenters={workCenters?.data}
                    value={data.work_center_id}
                    onChange={(val) => setData('work_center_id', val)}
                    error={errors.work_center_id}
                    tabIndex={5}
                    disabled={processing}
                    required={type === 'ABN'}
                />
            </div>

            <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                <Field className={type != 'ABN' ? 'sm:col-span-2' : undefined}>
                    <FieldLabel htmlFor="functional_location_id">
                        Funcloc (Area)
                        <RequiredLabel />
                    </FieldLabel>
                    <FunctionalLocationSelect
                        value={data.functional_location_id ?? ''}
                        processing={processing}
                        recentlySuccessful={recentlySuccessful}
                        tabIndex={6}
                        id="functional_location_id"
                        currentValue={functionalLocation}
                        onChange={(val) => setData('functional_location_id', val ? val.toString() : '')}
                        placeholder="Select funcloc"
                    />
                    <FieldError>{errors.functional_location_id}</FieldError>
                </Field>

                {type == 'ABN' && (
                    <Field>
                        <FieldLabel htmlFor="equipment_id">Equipment</FieldLabel>
                        <EquipmentSelect
                            value={data.equipment_id ?? ''}
                            processing={processing}
                            recentlySuccessful={recentlySuccessful}
                            tabIndex={7}
                            id="equipment_id"
                            currentValue={equipment}
                            onChange={(val) => setData('equipment_id', val ? val.toString() : '')}
                        />
                        <FieldError>{errors.equipment_id}</FieldError>
                    </Field>
                )}
            </div>

            <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                <FindingStatusSelect
                    statuses={findingStatuses?.data}
                    value={data.finding_status_id}
                    onChange={(val) => setData('finding_status_id', val)}
                    error={errors.finding_status_id}
                    tabIndex={8}
                    disabled={processing}
                />
                <FindingPrioritySelect
                    priorities={findingPriorities?.data}
                    value={data.finding_priority_id}
                    onChange={(val) => setData('finding_priority_id', val)}
                    error={errors.finding_priority_id}
                    tabIndex={9}
                    disabled={processing}
                />
            </div>

            {!isEditing && (
                <FindingPhotoInput
                    images={data.images}
                    onFileChange={handleFileChange}
                    error={errors.images}
                    isCompressing={isCompressing}
                    disabled={processing}
                    tabIndex={10}
                />
            )}

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || disabledWhen || (!isEditing ? data.images == null : false)}
                    tabIndex={11}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
