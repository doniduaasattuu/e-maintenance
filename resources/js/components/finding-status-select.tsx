import { GenericCombobox } from '@/components/generic-combobox';
import RequiredLabel from '@/components/required-label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FindingStatus } from '@/types';

interface FindingStatusSelectProps {
    statuses?: FindingStatus[];
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    placeholder?: string;
}

export default function FindingStatusSelect({
    statuses,
    value,
    onChange,
    error,
    disabled = false,
    tabIndex,
    required = true,
    placeholder = 'Select Status',
}: FindingStatusSelectProps) {
    return (
        <Field>
            <FieldLabel htmlFor="finding_status_id">
                Finding Status
                {required && <RequiredLabel />}
            </FieldLabel>
            <GenericCombobox
                id="finding_status_id"
                tabIndex={tabIndex}
                disabled={disabled}
                options={statuses ?? []}
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
