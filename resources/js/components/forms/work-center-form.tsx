import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

export type WorkCenterFormData = {
    code: string;
    name: string;
};

interface WorkCenterFormProps {
    data: Required<WorkCenterFormData>;
    setData: <K extends keyof WorkCenterFormData>(key: K, value: WorkCenterFormData[K]) => void;
    errors: Partial<Record<keyof WorkCenterFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
}

export default function WorkCenterForm({
    data,
    setData,
    errors,
    processing,
    submit,
    canSubmit,
    recentlySuccessful,
    successMessage,
    buttonLabel,
}: WorkCenterFormProps) {
    return (
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
                    placeholder="ELECTRIC NON SHIFT PM37"
                    required
                    disabled={processing}
                    autoComplete="name"
                />

                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>

                <Input
                    tabIndex={2}
                    id="code"
                    className="mt-1 block w-full"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    placeholder="PME21001"
                    required
                    disabled={processing}
                    autoComplete="code"
                />

                <InputError message={errors.code} />
            </div>

            {canSubmit && (
                <ButtonSubmit
                    label={buttonLabel}
                    disabled={processing || data.code == '' || data.name == ''}
                    tabIndex={3}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
