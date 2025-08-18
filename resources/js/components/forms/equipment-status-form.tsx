import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

interface EquipmentStatusFormProps {
    data: Required<EquipmentStatusFormData>;
    setData: <K extends keyof EquipmentStatusFormData>(key: K, value: EquipmentStatusFormData[K]) => void;
    errors: Partial<Record<keyof EquipmentStatusFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
}

export type EquipmentStatusFormData = {
    code: string;
    name: string;
    description: string;
};

export default function EquipmentStatusForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
}: EquipmentStatusFormProps) {
    return (
        <TableLayout title="Equipment Statuses" description="Overview and management of equipment status in the system">
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
                        placeholder="INST"
                        required
                        disabled={processing}
                        autoComplete="code"
                    />

                    <InputError message={errors.code} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>

                    <Input
                        tabIndex={2}
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value.toUpperCase())}
                        placeholder="INSTALLED"
                        required
                        disabled={processing}
                        autoComplete="name"
                    />

                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>

                    <Input
                        tabIndex={3}
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description ?? ''}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Equipment is currently installed and operational at its assigned location"
                        disabled={processing}
                        autoComplete="description"
                    />

                    <InputError message={errors.description} />
                </div>

                {canSubmit && (
                    <ButtonSubmit
                        disabled={processing || data.code == '' || data.name == ''}
                        tabIndex={4}
                        recentlySuccessful={recentlySuccessful}
                        successMessage={successMessage}
                        label={buttonLabel}
                    />
                )}
            </form>
        </TableLayout>
    );
}
