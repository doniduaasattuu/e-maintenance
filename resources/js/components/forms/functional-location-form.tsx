import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TableLayout from '@/layouts/table/layout';
import { Transition } from '@headlessui/react';
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
    successMessage: string;
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
}: FunctionalLocationFormProps) {
    return (
        <TableLayout title="Functional Locations" description="Overview and management of functional locations in the system">
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
                        required
                        disabled={processing}
                        autoComplete="description"
                    />

                    <InputError message={errors.description} />
                </div>

                {canSubmit && (
                    <div className="flex items-center gap-4">
                        <ButtonSubmit label={buttonLabel} disabled={processing} tabIndex={3} />

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="mt-2 text-sm text-neutral-600">{successMessage}</p>
                        </Transition>
                    </div>
                )}
            </form>
        </TableLayout>
    );
}
