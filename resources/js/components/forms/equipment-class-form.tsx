import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

interface EquipmentClassFormProps {
    data: Required<EquipmentClassFormData>;
    setData: <K extends keyof EquipmentClassFormData>(key: K, value: EquipmentClassFormData[K]) => void;
    errors: Partial<Record<keyof EquipmentClassFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
}

export type EquipmentClassFormData = {
    code: string;
    name: string;
    formable: string;
    description: string;
};

export default function EquipmentClassForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
}: EquipmentClassFormProps) {
    return (
        <TableLayout title="Equipment Classes" description="Overview and management of equipment class in the system">
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
                        placeholder="ZCLASS_E008"
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
                        placeholder="ELECTRICAL PANEL"
                        required
                        disabled={processing}
                        autoComplete="name"
                    />

                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="formable">Formable</Label>

                    <Input
                        tabIndex={3}
                        id="formable"
                        className="mt-1 block w-full"
                        value={data.formable ?? ''}
                        onChange={(e) => setData('formable', e.target.value)}
                        placeholder="PANEL"
                        disabled={processing}
                        autoComplete="formable"
                    />

                    <InputError message={errors.formable} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>

                    <Input
                        tabIndex={4}
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description ?? ''}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Distribution panels for managing electrical circuits and power systems."
                        disabled={processing}
                        autoComplete="description"
                    />

                    <InputError message={errors.description} />
                </div>

                {canSubmit && (
                    <ButtonSubmit
                        disabled={processing || data.code == '' || data.name == '' || data.formable == ''}
                        tabIndex={5}
                        recentlySuccessful={recentlySuccessful}
                        successMessage={successMessage}
                        label={buttonLabel}
                    />
                )}
            </form>
        </TableLayout>
    );
}
