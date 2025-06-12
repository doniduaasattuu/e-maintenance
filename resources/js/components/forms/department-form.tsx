import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Division } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

export type DepartmentFormData = {
    code: string;
    name: string;
    division_id?: string;
};

interface DepartmentFormProps {
    divisions: {
        data: Division[];
    };
    data: Required<DepartmentFormData>;
    setData: <K extends keyof DepartmentFormData>(key: K, value: DepartmentFormData[K]) => void;
    errors: Partial<Record<keyof DepartmentFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
}

export default function DepartmentForm({ divisions, data, setData, errors, processing, submit, canSubmit, buttonLabel }: DepartmentFormProps) {
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
                    onChange={(e) => setData('code', e.target.value)}
                    required
                    disabled={processing}
                    autoComplete="code"
                />

                <InputError message={errors.code} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="division">Division</Label>
                <Select disabled={processing} onValueChange={(e) => setData('division_id', e)} value={data.division_id}>
                    <SelectTrigger tabIndex={3} className="truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select a division" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Positions</SelectLabel>
                            {divisions.data.map((p) => {
                                return (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.code + ' - ' + p.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <InputError message={errors.division_id} />
            </div>

            <div className="flex items-center gap-4">{canSubmit && <ButtonSubmit label={buttonLabel} disabled={processing} tabIndex={4} />}</div>
        </form>
    );
}
