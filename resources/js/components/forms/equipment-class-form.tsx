import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface EquipmentClassFormProps {
    data: Required<EquipmentClassFormData>;
    setData: <K extends keyof EquipmentClassFormData>(key: K, value: EquipmentClassFormData[K]) => void;
    errors: Partial<Record<keyof EquipmentClassFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    isEditing?: boolean;
    className?: string;
}

export type EquipmentClassFormData = {
    code: string;
    name: string;
    formable_type: string;
    description: string;
};

export default function EquipmentClassForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
    isEditing = false,
    className,
}: EquipmentClassFormProps) {
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
                    autoFocus
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    placeholder="ZCLASS_E008"
                    required
                    disabled={processing}
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
                    tabIndex={2}
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                    placeholder="ELECTRICAL PANEL"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="formable_type">
                    Formable
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={3}
                    id="formable_type"
                    value={data.formable_type ?? ''}
                    onChange={(e) => setData('formable_type', e.target.value)}
                    placeholder="PANEL"
                    disabled={processing || isEditing}
                    autoComplete="formable_type"
                />
                <FieldError>{errors.formable_type}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                    tabIndex={4}
                    id="description"
                    value={data.description ?? ''}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Distribution panels for managing electrical circuits and power systems."
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.code == '' || data.name == '' || data.formable_type == ''}
                    tabIndex={5}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
