import ButtonSubmit from '@/components/button-submit';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormEventHandler } from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface PlantFormParams {
    submit: FormEventHandler;
    data: Required<PlantFormData>;
    setData: <K extends keyof PlantFormData>(key: K, value: PlantFormData[K]) => void;
    processing: boolean;
    errors: Partial<Record<keyof PlantFormData, string>>;
    buttonLabel: string;
    canSubmit: boolean;
    recentlySuccessful: boolean;
    successMessage?: string;
    className?: string;
}

export type PlantFormData = {
    code: string;
    name: string;
    sort_order: string;
};

export default function PlantForm({
    submit,
    data,
    setData,
    processing,
    errors,
    buttonLabel,
    canSubmit,
    recentlySuccessful,
    successMessage,
    className,
}: PlantFormParams) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="code">Code</FieldLabel>
                <div className="flex gap-2">
                    <Input
                        id="code"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="code"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        disabled={processing}
                        placeholder="MC-01"
                    />
                </div>
                <FieldError>{errors.code}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <div className="flex gap-2">
                    <Input
                        id="name"
                        type="text"
                        required
                        tabIndex={2}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Machine 1"
                    />
                </div>
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="sort_order">Sort Order</FieldLabel>
                <div className="flex gap-2">
                    <Input
                        id="sort_order"
                        type="text"
                        required
                        tabIndex={3}
                        autoComplete="sort_order"
                        value={data.sort_order}
                        onChange={(e) => setData('sort_order', e.target.value)}
                        disabled={processing}
                        placeholder="1"
                    />
                </div>
                <FieldError>{errors.sort_order}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    label={buttonLabel}
                    disabled={processing || data.name === ''}
                    tabIndex={4}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
