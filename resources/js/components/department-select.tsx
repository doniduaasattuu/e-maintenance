import { GenericCombobox } from '@/components/generic-combobox';
import RequiredLabel from '@/components/required-label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Department } from '@/types';

interface DepartmentSelectProps {
    departments?: Department[];
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    placeholder?: string;
}

export default function DepartmentSelect({
    departments,
    value,
    onChange,
    error,
    disabled = false,
    tabIndex,
    required = true,
    placeholder = 'Responsible Department',
}: DepartmentSelectProps) {
    return (
        <Field>
            <FieldLabel htmlFor="department_id">
                Department
                {required && <RequiredLabel />}
            </FieldLabel>
            <GenericCombobox
                id="department_id"
                tabIndex={tabIndex}
                disabled={disabled}
                options={departments ?? []}
                valueKey="id"
                labelKey="name"
                defaultValue={typeof value === 'number' ? String(value) : value}
                placeholder={placeholder}
                onChange={onChange}
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
