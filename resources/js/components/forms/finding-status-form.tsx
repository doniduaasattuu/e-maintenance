import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

interface FindingStatusFormProps {
    data: Required<FindingStatusFormData>;
    setData: <K extends keyof FindingStatusFormData>(key: K, value: FindingStatusFormData[K]) => void;
    errors: Partial<Record<keyof FindingStatusFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
}

export type FindingStatusFormData = {
    name: string;
    description: string;
};

export default function FindingStatusForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
}: FindingStatusFormProps) {
    return (
        <TableLayout title="Finding Statuses" description="Overview and management of finding status in the system">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>

                    <Input
                        tabIndex={1}
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Open"
                        required
                        disabled={processing}
                        autoComplete="name"
                    />

                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>

                    <Input
                        tabIndex={2}
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description ?? ''}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="A new issue has been identified and submitted from the field"
                        disabled={processing}
                        autoComplete="description"
                    />

                    <InputError message={errors.description} />
                </div>

                {canSubmit && (
                    <ButtonSubmit
                        disabled={processing || data.name == '' || data.description == ''}
                        tabIndex={3}
                        recentlySuccessful={recentlySuccessful}
                        successMessage={successMessage}
                        label={buttonLabel}
                    />
                )}
            </form>
        </TableLayout>
    );
}
