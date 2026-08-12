import { ChangeEvent, FormEventHandler, useState } from 'react';

import { useImageCompressor } from '@/hooks/use-image-compressor';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, handleImageUploadHelper } from '@/lib/utils';
import { Department, Equipment, FunctionalLocation, ImprovementCategory, ImprovementStatus } from '@/types';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import ButtonSubmit from '../button-submit';
import EquipmentSelect from '../equipment-select';
import FunctionalLocationSelect from '../functional-location-select';
import PhotoInput from '../photo-input';
import RequiredLabel from '../required-label';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface ImprovementFormProps {
    data: ImprovementFormData;
    setData: <K extends keyof ImprovementFormData>(key: K, value: ImprovementFormData[K]) => void;
    errors: Partial<Record<keyof ImprovementFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;

    departments: {
        data: Department[];
    };
    improvementCategories: {
        data: ImprovementCategory[];
    };
    improvementStatuses: {
        data: ImprovementStatus[];
    };
    isEditing?: boolean;
    selectedFunctionalLocation?: FunctionalLocation | null | undefined;
    selectedEquipment?: Equipment | null | undefined;
}

export type ImprovementFormData = {
    functional_location_id: string;
    equipment_id: string;
    department_id: string;
    improvement_category_id: string;
    improvement_status_id?: string;

    title: string;
    problem: string;
    description: string;
    root_cause: string;

    expected_benefit: string;
    actual_benefit: string;

    implementation_date: string;
    remarks: string;

    images_before: File[] | null;
    images_after: File[] | null;
};

export default function ImprovementForm({
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
    departments,
    improvementCategories,
    selectedFunctionalLocation,
    selectedEquipment,
    isEditing,
}: ImprovementFormProps) {
    const date = new Date(data.implementation_date);
    const [implementationDate, setImplementationDate] = useState<Date | undefined>(date);
    const compressImage = useImageCompressor();
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const isMobile = useIsMobile();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldKey: string) => {
        handleImageUploadHelper({
            e,
            compressFn: compressImage,
            setIsCompressing,
            setData,
            fieldKey: fieldKey,
        });
    };

    function Header({ str }: { str: string }) {
        return <h1 className="text-muted-foreground text-sm font-semibold">{str}</h1>;
    }

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <div className="grid max-w-7xl grid-cols-1 gap-8 space-y-6 rounded-xl lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7 xl:col-span-6">
                    <Header str="Asset Information" />
                    <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                        <Field>
                            <FieldLabel htmlFor="functional_location_id">
                                Funcloc (Area)
                                <RequiredLabel />
                            </FieldLabel>
                            <FunctionalLocationSelect
                                isEditing={isEditing}
                                showDismantleButton={isEditing ? false : true}
                                currentValue={selectedFunctionalLocation}
                                value={data.functional_location_id}
                                processing={processing}
                                recentlySuccessful={recentlySuccessful}
                                tabIndex={1}
                                id="functional_location_id"
                                onChange={(val) => setData('functional_location_id', val ? val.toString() : '')}
                                placeholder="Select funcloc"
                            />
                            <FieldError>{errors.functional_location_id}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="equipment_id">Equipment</FieldLabel>
                            <EquipmentSelect
                                isEditing={isEditing}
                                currentValue={selectedEquipment}
                                value={data.equipment_id ?? ''}
                                processing={processing}
                                recentlySuccessful={recentlySuccessful}
                                tabIndex={2}
                                id="equipment_id"
                                onChange={(val) => setData('equipment_id', val ? val.toString() : '')}
                                functionalLocationId={data.functional_location_id}
                            />
                            <FieldError>{errors.equipment_id}</FieldError>
                        </Field>
                    </div>

                    {/* Department */}
                    <Field>
                        <FieldLabel htmlFor="department">Department</FieldLabel>
                        <Select
                            disabled={processing}
                            value={data.department_id}
                            onValueChange={(value) => setData('department_id', value == 'null' ? '' : value)}
                        >
                            <SelectTrigger tabIndex={3} className="truncate overflow-hidden whitespace-nowrap">
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground">Departments</SelectLabel>
                                    {departments.data.map((d) => {
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
                    {/* Category */}
                    <Field>
                        <FieldLabel htmlFor="improvement_category_id">
                            Improvement Category
                            <RequiredLabel />
                        </FieldLabel>

                        <Select
                            disabled={processing}
                            value={data.improvement_category_id}
                            onValueChange={(value) => setData('improvement_category_id', value == 'null' ? '' : value)}
                        >
                            <SelectTrigger id="improvement_category_id" tabIndex={4} className="truncate overflow-hidden whitespace-nowrap">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground">Categories</SelectLabel>
                                    {improvementCategories &&
                                        improvementCategories.data.map((c) => {
                                            return (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.name}
                                                </SelectItem>
                                            );
                                        })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldError>{errors.improvement_category_id}</FieldError>
                    </Field>

                    <Header str="Improvement Details" />

                    {/* Title */}
                    <Field>
                        <FieldLabel htmlFor="title">
                            Title
                            <RequiredLabel />
                        </FieldLabel>

                        <Input
                            tabIndex={5}
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Replace TOR with EOCR"
                            required
                            disabled={processing}
                            autoComplete="off"
                        />
                        <FieldError>{errors.title}</FieldError>
                    </Field>

                    {/* Problem */}
                    <Field>
                        <FieldLabel htmlFor="problem">
                            Problem
                            <RequiredLabel />
                        </FieldLabel>

                        <Textarea
                            tabIndex={6}
                            id="problem"
                            value={data.problem}
                            onChange={(e) => setData('problem', e.target.value)}
                            placeholder="Describe the problem that led to this improvement..."
                            required
                            disabled={processing}
                            rows={4}
                        />
                        <FieldError>{errors.problem}</FieldError>
                    </Field>

                    {/* Description */}
                    <Field>
                        <FieldLabel htmlFor="description">
                            Improvement Description
                            <RequiredLabel />
                        </FieldLabel>

                        <Textarea
                            tabIndex={7}
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe the improvement that was or will be performed..."
                            required
                            disabled={processing}
                            rows={5}
                        />

                        <FieldError>{errors.description}</FieldError>
                    </Field>

                    {/* Root Cause */}
                    <Field>
                        <FieldLabel htmlFor="root_cause">
                            Root Cause
                            <RequiredLabel />
                        </FieldLabel>

                        <Textarea
                            tabIndex={8}
                            id="root_cause"
                            value={data.root_cause}
                            onChange={(e) => setData('root_cause', e.target.value)}
                            placeholder="Describe the root cause of the problem..."
                            required
                            disabled={processing}
                            rows={4}
                        />

                        <FieldError>{errors.root_cause}</FieldError>
                    </Field>

                    <Header str="Result & Benefit" />

                    {/* Expected Benefit */}
                    <Field>
                        <FieldLabel htmlFor="expected_benefit">Expected Benefit</FieldLabel>

                        <Textarea
                            tabIndex={9}
                            id="expected_benefit"
                            value={data.expected_benefit}
                            onChange={(e) => setData('expected_benefit', e.target.value)}
                            placeholder="Describe the expected benefit..."
                            disabled={processing}
                            rows={4}
                        />

                        <FieldError>{errors.expected_benefit}</FieldError>
                    </Field>

                    {/* Actual Benefit */}
                    <Field>
                        <FieldLabel htmlFor="actual_benefit">Actual Benefit</FieldLabel>

                        <Textarea
                            tabIndex={10}
                            id="actual_benefit"
                            value={data.actual_benefit}
                            onChange={(e) => setData('actual_benefit', e.target.value)}
                            placeholder="Describe the actual benefit after implementation..."
                            disabled={processing}
                            rows={4}
                        />

                        <FieldError>{errors.actual_benefit}</FieldError>
                    </Field>

                    {/* Implementation Date */}
                    <Field>
                        <FieldLabel htmlFor="implementation_date">
                            Implementation Date
                            <RequiredLabel />
                        </FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button tabIndex={11} size={'sm'} variant="outline" id="implementation_date" className="justify-between font-normal">
                                    {implementationDate ? format(implementationDate, 'PPP') : 'Select date'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-56.5 overflow-hidden p-0" align="start">
                                <Calendar
                                    className="w-full"
                                    mode="single"
                                    selected={implementationDate}
                                    captionLayout="dropdown"
                                    defaultMonth={implementationDate}
                                    onSelect={(date) => {
                                        if (date) {
                                            setImplementationDate(date);
                                            setData('implementation_date', format(date, 'yyyy-MM-dd'));
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <FieldError>{errors.implementation_date}</FieldError>
                    </Field>

                    {/* Remarks */}
                    <Field>
                        <FieldLabel htmlFor="remarks">Remarks</FieldLabel>

                        <Textarea
                            tabIndex={12}
                            id="remarks"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="Additional remarks..."
                            disabled={processing}
                            rows={4}
                        />

                        <FieldError>{errors.remarks}</FieldError>
                    </Field>
                </div>

                <div className="min-h-0 space-y-6 lg:col-span-5 xl:col-span-6">
                    <Header str="Improvement Evidence" />
                    {/* Photos Before */}
                    <PhotoInput
                        fieldId="images_before"
                        label="Photos Before"
                        variant={isMobile ? 'standard' : 'dropzone'}
                        images={data.images_before}
                        onFileChange={(e) => handleFileChange(e, 'images_before')}
                        error={errors.images_before}
                        isCompressing={isCompressing}
                        disabled={processing}
                        tabIndex={13}
                        onRemoveImage={(index: number) => {
                            const newImages = data.images_before?.filter((_, idx) => idx !== index) || null;
                            setData('images_before', newImages && newImages.length > 0 ? newImages : null);
                        }}
                    />

                    {/* Photos After */}
                    <PhotoInput
                        fieldId="images_after"
                        label="Photos After"
                        variant={isMobile ? 'standard' : 'dropzone'}
                        images={data.images_after}
                        onFileChange={(e) => handleFileChange(e, 'images_after')}
                        error={errors.images_after}
                        isCompressing={isCompressing}
                        disabled={processing}
                        tabIndex={14}
                        onRemoveImage={(index: number) => {
                            const newImages = data.images_after?.filter((_, idx) => idx !== index) || null;
                            setData('images_after', newImages && newImages.length > 0 ? newImages : null);
                        }}
                    />

                    {canSubmit && (
                        <ButtonSubmit
                            processing={processing}
                            disabled={
                                processing ||
                                data.functional_location_id === '' ||
                                data.improvement_category_id === '' ||
                                data.title === '' ||
                                data.problem === '' ||
                                data.description === '' ||
                                data.root_cause === '' ||
                                (!isEditing && data.images_before == null) ||
                                (!isEditing && data.images_after == null)
                            }
                            tabIndex={15}
                            recentlySuccessful={recentlySuccessful}
                            successMessage={successMessage}
                            label={buttonLabel}
                        />
                    )}
                </div>
            </div>
        </form>
    );
}
