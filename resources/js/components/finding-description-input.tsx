import RequiredLabel from '@/components/required-label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

interface FindingDescriptionInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    label?: string;
    placeholder?: string;
    rows?: number;
}

export default function FindingDescriptionInput({
    value,
    onChange,
    error,
    disabled = false,
    tabIndex,
    required = true,
    label = 'Description',
    placeholder = 'Explain the issue clearly...',
    rows = 3,
}: FindingDescriptionInputProps) {
    return (
        <Field>
            <FieldLabel htmlFor="description">
                {label}
                {required && <RequiredLabel />}
            </FieldLabel>
            <Textarea
                id="description"
                tabIndex={tabIndex}
                disabled={disabled}
                className="text-sm"
                rows={rows}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
