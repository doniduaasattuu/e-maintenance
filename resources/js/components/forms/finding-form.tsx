import { useImageCompressor } from '@/hooks/use-image-compressor';
import { useIsMobile } from '@/hooks/use-mobile';
import truncateText, { cn } from '@/lib/utils';
import { Department, Equipment, FindingClause, FindingPriority, FindingStatus, FunctionalLocation } from '@/types';
import { Info } from 'lucide-react';
import React, { ChangeEvent, FormEventHandler, useRef, useState } from 'react';
import ButtonSubmit from '../button-submit';
import CompressingDescription from '../compressing-description';
import EquipmentSelect from '../equipment-select';
import FunctionalLocationSelect from '../functional-location-select';
import RequiredLabel from '../required-label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
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
    departments: {
        data: Department[];
    };
    isEditing?: boolean;
    closedStatusId?: string | number | null;
}

export type FindingFormData = {
    finding_clause_id: string;
    finding_status_id: string;
    finding_priority_id: string;
    department_id: string;
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
    departments,
    functionalLocation,
    equipment,
    isEditing = false,
    closedStatusId,
}: FindingFormProps) {
    const [clauseDescription, setClauseDescription] = React.useState<string | null>(null);
    const [clauseCode, setClauseCode] = React.useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const compressImage = useImageCompressor();
    const [errorCompression, setErrorCompression] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

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

    const isStatusClosed = data.finding_status_id == closedStatusId;
    const isMobile = useIsMobile();

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="finding_clause_id">
                    Finding Clause
                    <RequiredLabel />
                </FieldLabel>
                <Select
                    disabled={processing}
                    onValueChange={(e) => {
                        setData('finding_clause_id', e);
                        setClauseDescription(findingClauses?.data?.[parseInt(e) - 1].description);
                        setClauseCode(findingClauses?.data?.[parseInt(e) - 1].code);
                    }}
                    value={data.finding_clause_id}
                >
                    <SelectTrigger tabIndex={1} className="truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select clause" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground truncate">Finding Clause</SelectLabel>
                            {findingClauses?.data?.map((fc: FindingClause) => {
                                return (
                                    <SelectItem key={fc.id} value={fc.id.toString()}>
                                        {fc.code} - {isMobile ? truncateText(fc.description, 35) : fc.description}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FieldError>{errors.finding_clause_id}</FieldError>
                {clauseCode && clauseDescription && (
                    <Alert>
                        <Info />
                        <AlertTitle>{clauseCode}</AlertTitle>
                        <AlertDescription>{clauseDescription}</AlertDescription>
                    </Alert>
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="description">
                    Description
                    <RequiredLabel />
                </FieldLabel>
                <Textarea
                    className="text-sm"
                    disabled={processing}
                    tabIndex={4}
                    id="description"
                    onChange={(val: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', val.target.value)}
                    value={data.description}
                    placeholder="Explain the issue clearly (e.g., 'Oil leak detected on the main pump seal, dripping approx. 1 drop/sec. Requires seal replacement.')"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="functional_location_id">
                    Funcloc (Area)
                    <RequiredLabel />
                </FieldLabel>
                <FunctionalLocationSelect
                    value={data.functional_location_id ?? ''}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    tabIndex={2}
                    id="functional_location_id"
                    currentValue={functionalLocation}
                    onChange={(val) => setData('functional_location_id', val ? val.toString() : '')}
                    placeholder="Select funcloc"
                />
                <FieldError>{errors.functional_location_id}</FieldError>
            </Field>

            <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                <Field>
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <Select disabled={processing} onValueChange={(e) => setData('department_id', e)} value={data.department_id}>
                        <SelectTrigger tabIndex={5} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Departments</SelectLabel>
                                {departments?.data?.map((d) => {
                                    return (
                                        <SelectItem key={d.id} value={d.id.toString()}>
                                            {d.code + ' - ' + d.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.department_id}</FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="equipment_id">Equipment</FieldLabel>
                    <EquipmentSelect
                        value={data.equipment_id ?? ''}
                        processing={processing}
                        recentlySuccessful={recentlySuccessful}
                        tabIndex={3}
                        id="equipment_id"
                        currentValue={equipment}
                        onChange={(val) => setData('equipment_id', val ? val.toString() : '')}
                    />
                    <FieldError>{errors.equipment_id}</FieldError>
                </Field>
            </div>

            {/*             
                <Field>
                    <FieldLabel htmlFor="notification">Notification</FieldLabel>
                    <Input
                        tabIndex={6}
                        id="notification"
                        value={data.notification}
                        onChange={(e) => setData('notification', e.target.value)}
                        placeholder="80012233"
                        inputMode="numeric"
                        disabled={processing}
                        autoComplete="notification"
                    />
                    <FieldError>{errors.notification}</FieldError>
                </Field> */}

            <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                <Field>
                    <FieldLabel htmlFor="finding_status_id">
                        Finding Status
                        <RequiredLabel />
                    </FieldLabel>
                    <Select
                        defaultValue="1"
                        disabled={processing}
                        onValueChange={(e) => setData('finding_status_id', e)}
                        value={data.finding_status_id}
                    >
                        <SelectTrigger tabIndex={7} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Finding Status</SelectLabel>
                                {findingStatuses?.data?.length > 0 &&
                                    findingStatuses.data.map((fs) => {
                                        return (
                                            <SelectItem key={fs.id} value={fs.id.toString()}>
                                                {fs.name}
                                            </SelectItem>
                                        );
                                    })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.finding_status_id}</FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="finding_priority_id">
                        Finding Priority
                        <RequiredLabel />
                    </FieldLabel>
                    <Select
                        defaultValue="1"
                        disabled={processing}
                        onValueChange={(e) => setData('finding_priority_id', e)}
                        value={data.finding_priority_id}
                    >
                        <SelectTrigger tabIndex={8} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Finding Priority</SelectLabel>
                                {findingPriorities?.data?.map((fp) => {
                                    return (
                                        <SelectItem key={fp.id} value={fp.id.toString()}>
                                            {fp.label}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.finding_priority_id}</FieldError>
                </Field>
            </div>

            {(isStatusClosed || !isEditing) && (
                <Field>
                    <FieldLabel htmlFor="images">
                        Photos
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        tabIndex={9}
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
                    disabled={
                        processing ||
                        data.finding_clause_id == '' ||
                        data.functional_location_id == '' ||
                        data.description == '' ||
                        (!isEditing ? data.images == null : isStatusClosed && data.images == null)
                    }
                    tabIndex={10}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
