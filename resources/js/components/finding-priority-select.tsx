import { GenericCombobox } from '@/components/generic-combobox';
import RequiredLabel from '@/components/required-label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FindingPriority } from '@/types';

interface FindingPrioritySelectProps {
    priorities?: FindingPriority[];
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    placeholder?: string;
}

export default function FindingPrioritySelect({
    priorities,
    value,
    onChange,
    error,
    disabled = false,
    tabIndex,
    required = true,
    placeholder = 'Select Priority',
}: FindingPrioritySelectProps) {
    return (
        <Field>
            <FieldLabel htmlFor="finding_priority_id">
                Finding Priority
                {required && <RequiredLabel />}
            </FieldLabel>
            <GenericCombobox
                id="finding_priority_id"
                tabIndex={tabIndex}
                disabled={disabled}
                options={priorities ?? []}
                valueKey="id"
                labelKey="label"
                defaultValue={typeof value === 'number' ? String(value) : value}
                placeholder={placeholder}
                onChange={onChange}
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
