import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface CurrentInputProps {
    id: string;
    label: string;
    tabIndex?: number;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
}

export default function CurrentInput({ id, label, tabIndex, value, placeholder, onChange, errorMessage, disabled, required }: CurrentInputProps) {
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
                placeholder={placeholder ?? 'A'}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
            />
            <FieldError>{errorMessage}</FieldError>
        </Field>
    );
}
