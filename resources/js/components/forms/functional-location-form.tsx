import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

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
}

export type FunctionalLocationFormData = {
    code: string;
    description: string;
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
}: FunctionalLocationFormProps) {
    return (
        <TableLayout title="Functional Locations" description="Overview and management of functional locations in the system" className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="code">Code</Label>

                    <Input
                        tabIndex={1}
                        id="code"
                        className="mt-1 block w-full"
                        value={data.code}
                        autoFocus
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        placeholder="FP-01-PM3-CUT-RWD"
                        required
                        disabled={processing}
                        autoComplete="code"
                    />

                    <InputError message={errors.code} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>

                    <Input
                        tabIndex={2}
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value.toUpperCase())}
                        placeholder="REWINDER #1 PM3"
                        required
                        disabled={processing}
                        autoComplete="description"
                    />

                    <InputError message={errors.description} />
                </div>

                {canSubmit && (
                    <ButtonSubmit
                        label={buttonLabel}
                        disabled={processing || data.code == '' || data.description == ''}
                        tabIndex={3}
                        recentlySuccessful={recentlySuccessful}
                        successMessage={successMessage}
                    />
                )}
            </form>
        </TableLayout>
    );
}
