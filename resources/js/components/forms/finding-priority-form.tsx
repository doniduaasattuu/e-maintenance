import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

interface FindingPriorityFormProps {
    data: Required<FindingPriorityFormData>;
    setData: <K extends keyof FindingPriorityFormData>(key: K, value: FindingPriorityFormData[K]) => void;
    errors: Partial<Record<keyof FindingPriorityFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
}

export type FindingPriorityFormData = {
    label: string;
    description: string;
    sla_resolution_hours: string;
};

export default function FindingPriorityForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
}: FindingPriorityFormProps) {
    return (
        <TableLayout title="Finding Priorities" description="Overview and management of finding priorities in the system">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="label">Label</Label>

                    <Input
                        tabIndex={1}
                        id="label"
                        className="mt-1 block w-full"
                        value={data.label}
                        onChange={(e) => setData('label', e.target.value)}
                        placeholder="Recommendation"
                        required
                        disabled={processing}
                        autoComplete="label"
                    />

                    <InputError message={errors.label} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>

                    <Input
                        tabIndex={2}
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description ?? ''}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Suggestions for reliability or maintenance optimization."
                        disabled={processing}
                        autoComplete="description"
                    />

                    <InputError message={errors.description} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="sla_resolution_hours">SLA Resolution Hours</Label>

                    <Input
                        tabIndex={3}
                        id="sla_resolution_hours"
                        className="mt-1 block w-full"
                        value={data.sla_resolution_hours ?? ''}
                        onChange={(e) => setData('sla_resolution_hours', e.target.value)}
                        placeholder="24"
                        disabled={processing}
                        inputMode="numeric"
                        autoComplete="sla_resolution_hours"
                    />

                    <InputError message={errors.sla_resolution_hours} />
                </div>

                {canSubmit && (
                    <ButtonSubmit
                        disabled={processing || data.label == '' || data.description == ''}
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
