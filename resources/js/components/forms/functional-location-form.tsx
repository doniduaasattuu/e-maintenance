import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface FunctionalLocationFormProps {
    data: Required<FunctionalLocationFormData>;
    setData: <K extends keyof FunctionalLocationFormData>(key: K, value: FunctionalLocationFormData[K]) => void;
    errors: Partial<Record<keyof FunctionalLocationFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
}

export type FunctionalLocationFormData = {
    code: string;
    description: string;
};

export default function FunctionalLocationForm({
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
}: FunctionalLocationFormProps) {
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
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="FP-01-PM3-CUT-RWD"
                    required
                    disabled={processing}
                    autoComplete="code"
                />
                <FieldError>{errors.code}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="description">
                    Description
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={2}
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value.toUpperCase())}
                    placeholder="REWINDER #1 PM3"
                    required
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    label={buttonLabel}
                    disabled={processing || data.code == '' || data.description == ''}
                    tabIndex={3}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
