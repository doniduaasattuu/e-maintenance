import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface UnitFormProps {
    data: Required<MaterialUnitFormData>;
    setData: <K extends keyof MaterialUnitFormData>(key: K, value: MaterialUnitFormData[K]) => void;
    errors: Partial<Record<keyof MaterialUnitFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    isEditing?: boolean;
    className?: string;
}

export type MaterialUnitFormData = {
    name: string;
};

export default function MaterialUnitForm({
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
}: UnitFormProps) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="name">
                    Name
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={1}
                    id="name"
                    value={data.name}
                    autoFocus
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Meter"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.name == ''}
                    tabIndex={2}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
