import { useImageCompressor } from '@/hooks/use-image-compressor';
import { cn } from '@/lib/utils';
import { CauseCode, Department, Equipment, FindingClause, FindingPriority, FindingStatus, FunctionalLocation, WorkCenter } from '@/types';
import { Info } from 'lucide-react';
import React, { ChangeEvent, FormEventHandler, useRef, useState } from 'react';
import ButtonSubmit from '../button-submit';
import CompressingDescription from '../compressing-description';
import EquipmentSelect from '../equipment-select';
import FunctionalLocationSelect from '../functional-location-select';
import { GenericCombobox } from '../generic-combobox';
import RequiredLabel from '../required-label';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

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
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const compressImage = useImageCompressor();
    const [errorCompression, setErrorCompression] = useState<string | null>(null);
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
                setErrorCompression(error.message);
            }
        } finally {
            setIsCompressing(false);
        }
    };

    const FieldClause = () => {
        return (
            <Field>
                <FieldLabel htmlFor="finding_clause_id">
                    Finding Clause
                    <RequiredLabel />
                </FieldLabel>
                <GenericCombobox
                    tabIndex={1}
                    id="finding_clause_id"
                    valueKey="id"
                    labelKey="description"
                    options={findingClauses?.data}
                    defaultValue={data.finding_clause_id}
                    placeholder="Clause"
                    onChange={(e) => {
                        setData('finding_clause_id', e);
                    }}
                />
                <FieldError>{errors.finding_clause_id}</FieldError>
            </Field>
        );
    };

    const FieldCauseCode = () => {
        return (
            <Field>
                <FieldLabel htmlFor="cause_code_id">
                    Cause Code
                    <RequiredLabel />
                </FieldLabel>
                <GenericCombobox
                    tabIndex={2}
                    id="cause_code_id"
                    valueKey="id"
                    labelKey="description"
                    options={causeCodes?.data}
                    defaultValue={data.cause_code_id}
                    placeholder="Cause Code"
                    onChange={(e) => {
                        setData('cause_code_id', e);
                    }}
                />
                <FieldError>{errors.cause_code_id}</FieldError>
            </Field>
        );
    };

    findingClauses.data = findingClauses.data.filter((e: FindingClause) => {
        return e.type.toLowerCase() == type.toLowerCase();
    });

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            {type == 'ABN' ? (
                <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                    <FieldClause />
                    <FieldCauseCode />
                </div>
            ) : (
                <FieldClause />
            )}

            <Field>
                <FieldLabel htmlFor="description">
                    Description
                    <RequiredLabel />
                </FieldLabel>
                <Textarea
                    className="text-sm"
                    disabled={processing}
                    tabIndex={3}
                    id="description"
                    onChange={(val: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', val.target.value)}
                    value={data.description}
                    placeholder="Explain the issue clearly (e.g., 'Oil leak detected on the main pump seal, dripping approx. 1 drop/sec. Requires seal replacement.')"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                <Field>
                    <FieldLabel htmlFor="department_id">
                        Department
                        {type == 'ABN' && <RequiredLabel />}
                    </FieldLabel>
                    <GenericCombobox
                        tabIndex={4}
                        id="department_id"
                        valueKey="id"
                        labelKey="name"
                        options={departments?.data}
                        defaultValue={data.department_id}
                        placeholder="Department"
                        onChange={(e) => {
                            setData('department_id', e);
                        }}
                    />
                    <FieldError>{errors.department_id}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="work_center_id">
                        Work Center
                        {type == 'ABN' && <RequiredLabel />}
                    </FieldLabel>
                    <GenericCombobox
                        tabIndex={5}
                        id="work_center_id"
                        valueKey="id"
                        labelKey="name"
                        options={workCenters?.data}
                        defaultValue={data.work_center_id}
                        placeholder="Work Center"
                        onChange={(e) => {
                            setData('work_center_id', e);
                        }}
                    />
                    <FieldError>{errors.work_center_id}</FieldError>
                </Field>
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
                <Field>
                    <FieldLabel htmlFor="finding_status_id">
                        Finding Status
                        <RequiredLabel />
                    </FieldLabel>
                    <GenericCombobox
                        tabIndex={8}
                        id="finding_status_id"
                        valueKey="id"
                        labelKey="name"
                        options={findingStatuses?.data}
                        defaultValue={data.finding_status_id}
                        placeholder="Finding Status"
                        onChange={(e) => {
                            setData('finding_status_id', e);
                        }}
                    />
                    <FieldError>{errors.finding_status_id}</FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="finding_priority_id">
                        Finding Priority
                        <RequiredLabel />
                    </FieldLabel>
                    <GenericCombobox
                        tabIndex={9}
                        id="finding_priority_id"
                        valueKey="id"
                        labelKey="label"
                        options={findingPriorities?.data}
                        defaultValue={data.finding_priority_id}
                        placeholder="Finding Priority"
                        onChange={(e) => {
                            setData('finding_priority_id', e);
                        }}
                    />
                    <FieldError>{errors.finding_priority_id}</FieldError>
                </Field>
            </div>

            {!isEditing && (
                <Field>
                    <FieldLabel htmlFor="images">
                        Photos
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        tabIndex={10}
                        type="file"
                        id="images"
                        multiple
                        ref={fileInputRef}
                        disabled={processing || isCompressing}
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.webp"
                    />
                    <FieldError>{errors.images || errorCompression}</FieldError>
                    <FieldDescription>
                        <div className="space-y-1">
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <Info className="text-muted-foreground size-3 shrink-0" />
                                Upload between 2 to 5 photos.
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <Info className="text-muted-foreground size-3 shrink-0" />
                                Images will be automatically compressed to optimize upload speed and storage.
                            </div>
                        </div>
                    </FieldDescription>
                    {isCompressing && <CompressingDescription />}
                </Field>
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
