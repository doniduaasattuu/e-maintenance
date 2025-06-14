import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

export type DivisionFormData = {
    code: string;
    name: string;
};

interface DivisionFormProps {
    data: Required<DivisionFormData>;
    setData: <K extends keyof DivisionFormData>(key: K, value: DivisionFormData[K]) => void;
    errors: Partial<Record<keyof DivisionFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
}

export default function DivisionForm({ data, setData, errors, processing, submit, canSubmit, buttonLabel }: DivisionFormProps) {
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
                    required
                    disabled={processing}
                    autoComplete="code"
                />

                <InputError message={errors.code} />
            </div>

            <div className="flex items-center gap-4">{canSubmit && <ButtonSubmit label={buttonLabel} disabled={processing} tabIndex={3} />}</div>
        </form>
    );
}
