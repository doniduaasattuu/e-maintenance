import { Input } from '@/components/ui/input';
import { cn, strTitle } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface ImprovementStatusFormProps {
    data: Required<ImprovementStatusFormData>;
    setData: <K extends keyof ImprovementStatusFormData>(key: K, value: ImprovementStatusFormData[K]) => void;
    errors: Partial<Record<keyof ImprovementStatusFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
}

export type ImprovementStatusFormData = {
    name: string;
    color: string;
    sequence: string;
};

export default function ImprovementStatusForm({
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
}: ImprovementStatusFormProps) {
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
                    onChange={(e) => setData('name', strTitle(e.target.value))}
                    placeholder="Approved"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="color">
                    Color
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={2}
                    id="color"
                    value={data.color ?? ''}
                    onChange={(e) => setData('color', e.target.value)}
                    placeholder="#31e981"
                    disabled={processing}
                    autoComplete="color"
                />
                <FieldError>{errors.color}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="sequence">
                    Sequence
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={3}
                    id="sequence"
                    inputMode="numeric"
                    value={data.sequence ?? ''}
                    onChange={(e) => setData('sequence', e.target.value)}
                    placeholder="1"
                    disabled={processing}
                    autoComplete="sequence"
                />
                <FieldError>{errors.sequence}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.name == '' || data.color == '' || data.sequence == ''}
                    tabIndex={4}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
