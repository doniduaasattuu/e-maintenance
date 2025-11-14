import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

interface MaterialTypeFormProps {
    data: Required<MaterialTypeFormData>;
    setData: <K extends keyof MaterialTypeFormData>(key: K, value: MaterialTypeFormData[K]) => void;
    errors: Partial<Record<keyof MaterialTypeFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
}

export type MaterialTypeFormData = {
    code: string;
    description: string;
};

export default function MaterialTypeForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
}: MaterialTypeFormProps) {
    return (
        <TableLayout title="Material Type" description="Overview and management of material types in the system">
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
                        placeholder="ND"
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
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="No Planning"
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
