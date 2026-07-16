import ButtonSubmit from '@/components/button-submit';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { FormEventHandler } from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface PermissionFormParams {
    submit: FormEventHandler;
    data: Required<PermissionFormData>;
    setData: <K extends keyof PermissionFormData>(key: K, value: PermissionFormData[K]) => void;
    processing: boolean;
    selectedPermissions: string[];
    setSelectedPermissions: React.Dispatch<React.SetStateAction<string[]>>;
    errors: Partial<Record<keyof PermissionFormData, string>>;
    buttonLabel: string;
    canSubmit: boolean;
    recentlySuccessful: boolean;
    successMessage?: string;
    className?: string;
}

export type PermissionFormData = {
    name: string;
};

export default function PermissionForm({
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
}: PermissionFormParams) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <div className="flex gap-2">
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="index_permission"
                    />
                </div>
                <FieldError>{errors.name}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    label={buttonLabel}
                    disabled={processing || data.name === ''}
                    tabIndex={2}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
