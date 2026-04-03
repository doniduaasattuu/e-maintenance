import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FindingType } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FindingClauseFormProps {
    data: Required<FindingClauseFormData>;
    setData: <K extends keyof FindingClauseFormData>(key: K, value: FindingClauseFormData[K]) => void;
    errors: Partial<Record<keyof FindingClauseFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
    isEditing?: boolean;
    findingTypes: {
        data: FindingType[];
    };
}

export type FindingClauseFormData = {
    code: string;
    type: string;
    title: string;
    description: string;
};

export default function FindingClauseForm({
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
    findingTypes,
}: FindingClauseFormProps) {
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
                    placeholder="R1.1"
                    required
                    disabled={processing}
                    autoComplete="code"
                />
                <FieldError>{errors.code}</FieldError>
            </Field>

            <Field>
                <FieldLabel>
                    Type
                    <RequiredLabel />
                </FieldLabel>
                <Select onValueChange={(e) => setData('type', e)}>
                    <SelectTrigger tabIndex={2}>
                        <SelectValue placeholder="Clause type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {findingTypes?.data?.map((e) => (
                                <SelectItem value={e.code}>{e.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FieldError>{errors.type}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="title">
                    Title
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={3}
                    id="title"
                    disabled={isEditing || processing}
                    value={data.title ?? ''}
                    onChange={(e) => setData('title', e.target.value.toLowerCase())}
                    placeholder="Abnormality"
                    required={!isEditing}
                    autoComplete="title"
                />
                <FieldError>{errors.title}</FieldError>
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
                    placeholder="There is identification of goods & a list of goods needed."
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.code == '' || data.type == '' || data.title == '' || data.description == ''}
                    tabIndex={5}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
