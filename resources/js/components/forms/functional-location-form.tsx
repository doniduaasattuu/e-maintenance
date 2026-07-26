import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plant } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
    plants: {
        data: Plant[];
    };
}

export type FunctionalLocationFormData = {
    code: string;
    description: string;
    plant_id?: string | null;
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
    plants,
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

            <Field>
                <FieldLabel htmlFor="plant_id">
                    Plant
                    <RequiredLabel />
                </FieldLabel>
                <Select value={data.plant_id ?? ''} onValueChange={(e) => setData('plant_id', e)}>
                    <SelectTrigger tabIndex={3}>
                        <SelectValue placeholder="Select Plant" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {plants?.data?.map((e) => (
                                <SelectItem value={e.id.toString()}>
                                    {e.code} - {e.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FieldError>{errors.plant_id}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
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
