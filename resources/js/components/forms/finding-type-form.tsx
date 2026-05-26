import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface FindingTypeFormProps {
    data: Required<FindingTypeFormData>;
    setData: <K extends keyof FindingTypeFormData>(key: K, value: FindingTypeFormData[K]) => void;
    errors: Partial<Record<keyof FindingTypeFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
    isEditing?: boolean;
}

export type FindingTypeFormData = {
    code: string;
    title: string;
    name: string;
    description: string;
};

export default function FindingTypeForm({
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
}: FindingTypeFormProps) {
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
                    placeholder="ABN"
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
                    placeholder="Abnormality"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="description">
                    Description
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={4}
                    id="description"
                    value={data.description ?? ''}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Findings of deviations from standard conditions found during patrols or daily operations."
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.code == '' || data.title == '' || data.name == '' || data.description == ''}
                    tabIndex={5}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
