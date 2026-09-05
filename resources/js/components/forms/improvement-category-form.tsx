import { Input } from '@/components/ui/input';
import { cn, strTitle } from '@/lib/utils';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Textarea } from '../ui/textarea';

interface ImprovementCategoryFormProps {
    data: Required<ImprovementCategoryFormData>;
    setData: <K extends keyof ImprovementCategoryFormData>(key: K, value: ImprovementCategoryFormData[K]) => void;
    errors: Partial<Record<keyof ImprovementCategoryFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
}

export type ImprovementCategoryFormData = {
    name: string;
    description: string;
};

export default function ImprovementCategoryForm({
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
}: ImprovementCategoryFormProps) {
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
                    placeholder="Electrical"
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
                <Textarea
                    tabIndex={2}
                    id="description"
                    value={data.description ?? ''}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Improvement related to electrical systems, components, and installations"
                    disabled={processing}
                    autoComplete="description"
                />
                <FieldError>{errors.description}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    disabled={processing || data.name == '' || data.description == ''}
                    tabIndex={3}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                    label={buttonLabel}
                />
            )}
        </form>
    );
}
