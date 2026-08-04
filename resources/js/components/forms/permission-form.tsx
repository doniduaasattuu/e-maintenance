import ButtonSubmit from '@/components/button-submit';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PermissionFormParams {
    submit: FormEventHandler;
    data: Required<PermissionFormData>;
    setData: <K extends keyof PermissionFormData>(key: K, value: PermissionFormData[K]) => void;
    processing: boolean;
    errors: Partial<Record<keyof PermissionFormData, string>>;
    buttonLabel: string;
    canSubmit: boolean;
    recentlySuccessful: boolean;
    successMessage?: string;
    className?: string;
    editing?: boolean;
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
    editing = false,
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

            {editing && (
                <div className="w-full">
                    <Alert className="border border-yellow-400">
                        <AlertCircle />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            Changing the permission name may break existing role assignments and authorization checks. Proceed only if you understand
                            the consequences.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

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
