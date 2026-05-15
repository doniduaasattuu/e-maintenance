import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface TemperatureInputProps {
    id: string;
    label: string;
    tabIndex?: number;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    errorMessage?: string;
    required?: boolean;
    disabled?: boolean;
    processing?: boolean;
}

export default function TemperatureInput({
    id,
    label,
    tabIndex,
    value,
    placeholder,
    onChange,
    errorMessage,
    disabled,
    required,
    processing,
}: TemperatureInputProps) {
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
                required={required}
                placeholder={placeholder ?? '°C'}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || processing}
            />
            <FieldError>{errorMessage}</FieldError>
        </Field>
    );
}
