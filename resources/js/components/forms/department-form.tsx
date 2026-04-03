import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Division } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

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
    successMessage?: string;
    className?: string;
}

export default function DepartmentForm({
    divisions,
    data,
    setData,
    errors,
    processing,
    submit,
    canSubmit,
    buttonLabel,
    recentlySuccessful,
    successMessage,
    className,
}: DepartmentFormProps) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="name">
                    Name
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={1}
                    id="name"
                    value={data.name}
                    autoFocus
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="ELECTRIC INSTRUMENT #2"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="code">
                    Code
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={2}
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    placeholder="EI2"
                    required
                    disabled={processing}
                    autoComplete="code"
                />
                <FieldError>{errors.code}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="division">Division</FieldLabel>{' '}
                <Select disabled={processing} onValueChange={(e) => setData('division_id', e)} value={data.division_id}>
                    <SelectTrigger tabIndex={3} className="truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select a division" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Divisions</SelectLabel>
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
                <FieldError>{errors.division_id}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    label={buttonLabel}
                    disabled={processing || data.code == '' || data.name == ''}
                    tabIndex={4}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
