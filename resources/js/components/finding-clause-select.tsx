import { GenericCombobox } from '@/components/generic-combobox';
import RequiredLabel from '@/components/required-label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FindingClause } from '@/types';

interface FindingClauseSelectProps {
    clauses?: FindingClause[];
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    placeholder?: string;
}

export default function FindingClauseSelect({
    clauses,
    value,
    onChange,
    error,
    disabled = false,
    tabIndex,
    required = true,
    placeholder = 'Select Clause',
}: FindingClauseSelectProps) {
    return (
        <Field>
            <FieldLabel htmlFor="finding_clause_id">
                Finding Clause
                {required && <RequiredLabel />}
            </FieldLabel>
            <GenericCombobox
                id="finding_clause_id"
                tabIndex={tabIndex}
                disabled={disabled}
                options={clauses ?? []}
                valueKey="id"
                labelKey="description"
                defaultValue={typeof value === 'number' ? String(value) : value}
                placeholder={placeholder}
                onChange={onChange}
                align="start"
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
