import { GenericCombobox } from '@/components/generic-combobox';
import RequiredLabel from '@/components/required-label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CauseCode } from '@/types';

interface CauseCodeSelectProps {
    causeCodes?: CauseCode[];
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    placeholder?: string;
}

export default function CauseCodeSelect({
    causeCodes,
    value,
    onChange,
    error,
    disabled = false,
    tabIndex,
    required = true,
    placeholder = 'Select Cause Code',
}: CauseCodeSelectProps) {
    return (
        <Field>
            <FieldLabel htmlFor="cause_code_id">
                Cause Code
                {required && <RequiredLabel />}
            </FieldLabel>
            <GenericCombobox
                id="cause_code_id"
                tabIndex={tabIndex}
                disabled={disabled}
                options={causeCodes ?? []}
                valueKey="id"
                labelKey="description"
                defaultValue={typeof value === 'number' ? String(value) : value}
                placeholder={placeholder}
                onChange={onChange}
                align="end"
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
