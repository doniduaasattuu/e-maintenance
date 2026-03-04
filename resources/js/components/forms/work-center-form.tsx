import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import { Field, FieldError, FieldLabel } from '../ui/field';

export type WorkCenterFormData = {
    code: string;
    name: string;
};

interface WorkCenterFormProps {
    data: Required<WorkCenterFormData>;
    setData: <K extends keyof WorkCenterFormData>(key: K, value: WorkCenterFormData[K]) => void;
    errors: Partial<Record<keyof WorkCenterFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
}

export default function WorkCenterForm({
    data,
    setData,
    errors,
    processing,
    submit,
    canSubmit,
    recentlySuccessful,
    successMessage,
    buttonLabel,
    className,
}: WorkCenterFormProps) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                    tabIndex={1}
                    id="name"
                    value={data.name}
                    autoFocus
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="ELECTRIC NON SHIFT PM37"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="code">Code</FieldLabel>
                <Input
                    tabIndex={2}
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    placeholder="PME21001"
                    required
                    disabled={processing}
                    autoComplete="code"
                />
                <FieldError>{errors.code}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    label={buttonLabel}
                    disabled={processing || data.code == '' || data.name == ''}
                    tabIndex={3}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
