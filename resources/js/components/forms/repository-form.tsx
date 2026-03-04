import ButtonSubmit from '@/components/button-submit';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { FormEventHandler } from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface RepositoryFormParams {
    submit: FormEventHandler;
    data: Required<RepositoryFormData>;
    setData: <K extends keyof RepositoryFormData>(key: K, value: RepositoryFormData[K]) => void;
    processing: boolean;
    errors: Partial<Record<keyof RepositoryFormData, string>>;
    buttonLabel: string;
    canSubmit: boolean;
    editing?: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    recentlySuccessful: boolean;
    successMessage?: string;
    className?: string;
}

export type RepositoryFormData = {
    title: string;
    file: File | null;
};

export default function RepositoryForm({
    submit,
    data,
    setData,
    fileInputRef,
    processing,
    errors,
    buttonLabel,
    canSubmit,
    editing = false,
    recentlySuccessful,
    successMessage,
    className,
}: RepositoryFormParams) {
    return (
        <form className={cn('space-y-6', className)} onSubmit={submit}>
            <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    disabled={processing}
                    placeholder="Schematic Diagram Panel Incoming 20kV Switchgear ENC"
                />
                <FieldError>{errors.title}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="file">File</FieldLabel>
                <Input
                    id="file"
                    name="file"
                    type="file"
                    disabled={processing}
                    ref={fileInputRef}
                    tabIndex={2}
                    onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                />
                <FieldError>{errors.file}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    label={buttonLabel}
                    disabled={processing || (data.title === '' || !editing ? data.file === null : !editing)}
                    tabIndex={3}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
