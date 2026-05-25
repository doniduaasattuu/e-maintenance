import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Department } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import DepartmentSelect from '../department-select';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

export type WorkCenterFormData = {
    code: string;
    name: string;
    department_id?: string;
};

interface WorkCenterFormProps {
    data: Required<WorkCenterFormData>;
    setData: <K extends keyof WorkCenterFormData>(key: K, value: WorkCenterFormData[K]) => void;
    errors: Partial<Record<keyof WorkCenterFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    departments: {
        data: Department[];
    };
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    className?: string;
}

export default function WorkCenterForm({
    data,
    setData,
    errors,
    processing,
    submit,
    canSubmit,
    recentlySuccessful,
    departments,
    successMessage,
    buttonLabel,
    className,
}: WorkCenterFormProps) {
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
                    placeholder="ELECTRIC NON SHIFT PM37"
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
                    placeholder="PME21001"
                    required
                    disabled={processing}
                    autoComplete="code"
                />
                <FieldError>{errors.code}</FieldError>
            </Field>

            <DepartmentSelect
                departments={departments?.data}
                value={data.department_id}
                onChange={(val) => setData('department_id', val)}
                error={errors.department_id}
                tabIndex={3}
                disabled={processing}
                required={true}
                placeholder="Select Department"
            />

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    label={buttonLabel}
                    disabled={processing || data.code == '' || data.name == '' || data.department_id == ''}
                    tabIndex={4}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
