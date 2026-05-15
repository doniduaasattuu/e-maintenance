import { GenericCombobox } from '@/components/generic-combobox';
import RequiredLabel from '@/components/required-label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { WorkCenter } from '@/types';

interface WorkCenterSelectProps {
    workCenters: WorkCenter[];
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    placeholder?: string;
}

export default function WorkCenterSelect({
    workCenters,
    value,
    onChange,
    error,
    disabled = false,
    tabIndex,
    required = true,
    placeholder = 'Responsible Work Center',
}: WorkCenterSelectProps) {
    return (
        <Field>
            <FieldLabel htmlFor="work_center_id">
                Work Center
                {required && <RequiredLabel />}
            </FieldLabel>
            <GenericCombobox
                id="work_center_id"
                tabIndex={tabIndex}
                disabled={disabled}
                options={workCenters}
                valueKey="id"
                labelKey="name"
                defaultValue={typeof value === 'number' ? String(value) : value}
                placeholder={placeholder ?? 'Responsible Work Center'}
                onChange={onChange}
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
