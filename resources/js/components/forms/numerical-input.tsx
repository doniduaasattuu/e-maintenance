import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface Props {
    id?: string;
    label?: string;
    tabIndex?: number;
    value?: string;
    onChange: (value: string) => void;
    errorMessage?: string;
    processing?: boolean;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export default function NumericalInput({ id, label, tabIndex, value, onChange, errorMessage, disabled, required, placeholder }: Props) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>
                {label}
                {required && <RequiredLabel />}
            </FieldLabel>
            <Input
                id={id}
                type="text"
                tabIndex={tabIndex}
                autoComplete={id}
                inputMode="numeric"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
            <FieldError>{errorMessage}</FieldError>
        </Field>
    );
}
