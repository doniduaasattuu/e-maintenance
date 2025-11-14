import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

interface UnitFormProps {
    data: Required<UnitFormData>;
    setData: <K extends keyof UnitFormData>(key: K, value: UnitFormData[K]) => void;
    errors: Partial<Record<keyof UnitFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    isEditing?: boolean;
}

export type UnitFormData = {
    name: string;
};

export default function UnitForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
}: UnitFormProps) {
    return (
        <TableLayout title="Unit" description="Overview and management of unit in the system">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>

                    <Input
                        tabIndex={1}
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Meter"
                        required
                        disabled={processing}
                        autoComplete="name"
                    />

                    <InputError message={errors.name} />
                </div>

                {canSubmit && (
                    <ButtonSubmit
                        disabled={processing || data.name == ''}
                        tabIndex={2}
                        recentlySuccessful={recentlySuccessful}
                        successMessage={successMessage}
                        label={buttonLabel}
                    />
                )}
            </form>
        </TableLayout>
    );
}
