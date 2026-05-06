import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface FindingPriorityFormProps {
    data: Required<FindingPriorityFormData>;
    setData: <K extends keyof FindingPriorityFormData>(key: K, value: FindingPriorityFormData[K]) => void;
    errors: Partial<Record<keyof FindingPriorityFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
}

export type FindingPriorityFormData = {
    label: string;
    description: string;
    color_code: string;
    sla_resolution_hours: string;
};

export default function FindingPriorityForm({
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
}: FindingPriorityFormProps) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="label">
                    Label
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={1}
                    id="label"
                    value={data.label}
                    onChange={(e) => setData('label', e.target.value)}
                    placeholder="Recommendation"
                    required
                    disabled={processing}
                    autoComplete="label"
                />
                <FieldError>{errors.label}</FieldError>
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
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Suggestions for reliability or maintenance optimization."
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="color_code">Color Code</FieldLabel>
                <Input
                    tabIndex={2}
                    id="color_code"
                    value={data.color_code ?? ''}
                    onChange={(e) => setData('color_code', e.target.value)}
                    placeholder="#31e981"
                    disabled={processing}
                    autoComplete="color_code"
                />
                <FieldError>{errors.color_code}</FieldError>
            </Field>

            <div className="grid gap-2">
                <FieldLabel htmlFor="sla_resolution_hours">SLA Resolution Hours</FieldLabel>
                <Input
                    tabIndex={3}
                    id="sla_resolution_hours"
                    value={data.sla_resolution_hours ?? ''}
                    onChange={(e) => setData('sla_resolution_hours', e.target.value)}
                    placeholder="24"
                    disabled={processing}
                    inputMode="numeric"
                    autoComplete="sla_resolution_hours"
                />
                <FieldError>{errors.sla_resolution_hours}</FieldError>
            </div>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.label == '' || data.description == ''}
                    tabIndex={4}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
