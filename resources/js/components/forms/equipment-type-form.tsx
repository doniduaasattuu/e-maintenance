import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EquipmentClass } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import BinarySelect from './binary-select';

interface EquipmentTypeFormProps {
    data: Required<EquipmentTypeFormData>;
    setData: <K extends keyof EquipmentTypeFormData>(key: K, value: EquipmentTypeFormData[K]) => void;
    errors: Partial<Record<keyof EquipmentTypeFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
    isEditing?: boolean;
    equipmentClasses: {
        data: EquipmentClass[];
    };
}

export type EquipmentTypeFormData = {
    code: string;
    name: string;
    description: string;
    equipment_class_id: string;
    is_active: string;
};

export default function EquipmentTypeForm({
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
    isEditing,
    equipmentClasses,
}: EquipmentTypeFormProps) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="code">
                    Code
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={1}
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="ZTYPE_P001"
                    required
                    disabled={processing || isEditing}
                    autoComplete="code"
                />
                <FieldError>{errors.code}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="name">
                    Name
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={3}
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Main Distribution Panel"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                    tabIndex={4}
                    id="description"
                    value={data.description ?? ''}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="The central unit of any electrical system to receive electrical power ."
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="equipment_class_id">
                    Equipment class
                    <RequiredLabel />
                </FieldLabel>
                <Select disabled={processing} onValueChange={(e) => setData('equipment_class_id', e)} value={data.equipment_class_id}>
                    <SelectTrigger tabIndex={5} className="truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select a equipment class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Equipment class</SelectLabel>
                            {equipmentClasses &&
                                equipmentClasses.data.map((p) => {
                                    return (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.code + ' - ' + p.name}
                                        </SelectItem>
                                    );
                                })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FieldError>{errors.equipment_class_id}</FieldError>
            </Field>

            <BinarySelect
                required
                processing={processing}
                onChange={(value) => setData('is_active', value)}
                errorMessage={errors.is_active}
                tabIndex={6}
                value={data.is_active}
                label="Active"
                id="is_active"
                selectLabel="Type is active"
                placeholder="This type is active for form template?"
            />

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.code == '' || data.name == '' || data.equipment_class_id == ''}
                    tabIndex={7}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
