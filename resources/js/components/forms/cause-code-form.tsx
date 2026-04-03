import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface CauseCodeFormProps {
    data: Required<CauseCodeFormData>;
    setData: <K extends keyof CauseCodeFormData>(key: K, value: CauseCodeFormData[K]) => void;
    errors: Partial<Record<keyof CauseCodeFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
    isEditing?: boolean;
}

export type CauseCodeFormData = {
    code: string;
    description: string;
};

export default function CauseCodeForm({
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
}: CauseCodeFormProps) {
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
                    placeholder="C100"
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
                    value={data.description ?? ''}
                    onChange={(e) => setData('description', e.target.value.toUpperCase())}
                    placeholder="INSTALLATION ERROR"
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.code == '' || data.description == ''}
                    tabIndex={3}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
