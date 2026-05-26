import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

interface Props {
    required?: boolean;
    processing?: boolean;
    onChange?: (value: string) => void;
    errorMessage?: string;
    tabIndex?: number;
    value?: string;
    label?: string;
    placeholder?: string;
    id?: string;
    selectLabel?: string;
}

export default function BinarySelect({ required, processing, onChange, errorMessage, tabIndex, value, label, placeholder, id, selectLabel }: Props) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>
                {label}
                {required && <RequiredLabel />}
            </FieldLabel>
            <Select disabled={processing} onValueChange={onChange} value={value}>
                <SelectTrigger id={id} tabIndex={tabIndex} className="truncate overflow-hidden whitespace-nowrap">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel className="text-muted-foreground">{selectLabel}</SelectLabel>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <FieldError>{errorMessage}</FieldError>
        </Field>
    );
}
