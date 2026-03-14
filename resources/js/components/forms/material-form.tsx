import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MaterialType, MaterialUnit } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface MaterialFormProps {
    data: Required<MaterialFormData>;
    setData: <K extends keyof MaterialFormData>(key: K, value: MaterialFormData[K]) => void;
    errors: Partial<Record<keyof MaterialFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
    materialUnits: MaterialUnit[];
    materialTypes: MaterialType[];
    className?: string;
}

export type MaterialFormData = {
    code: string;
    name: string;
    price: string | null;
    material_unit_id: string | undefined;
    material_type_id: string | undefined;
};

export default function MaterialForm({
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    submit,
    canSubmit,
    buttonLabel,
    successMessage,
    materialUnits,
    materialTypes,
    className,
}: MaterialFormProps) {
    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="code">
                    Code
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={1}
                    id="code"
                    type="numeric"
                    value={data.code}
                    autoFocus
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    placeholder="10018891"
                    required
                    disabled={processing}
                    autoComplete="code"
                />
                <FieldError>{errors.code}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="name">
                    Name
                    <RequiredLabel />
                </FieldLabel>
                <Input
                    tabIndex={2}
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="BEARING NU"
                    required
                    disabled={processing}
                    autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                    tabIndex={3}
                    id="price"
                    value={data.price?.toString()}
                    onChange={(e) => setData('price', e.target.value)}
                    placeholder="50000"
                    required
                    type="numeric"
                    disabled={processing}
                    autoComplete="price"
                />
                <FieldError>{errors.price}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="unit">Unit</FieldLabel>
                <Select disabled={processing} onValueChange={(e) => setData('material_unit_id', e)} value={data.material_unit_id}>
                    <SelectTrigger tabIndex={4} className="truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Unit</SelectLabel>
                            {materialUnits?.map((materialUnit: MaterialUnit) => {
                                return (
                                    <SelectItem key={materialUnit.id} value={materialUnit.id.toString()}>
                                        {materialUnit.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FieldError>{errors.material_unit_id}</FieldError>
            </Field>

            <Field>
                <FieldLabel htmlFor="material_type">Type</FieldLabel>
                <Select disabled={processing} onValueChange={(e) => setData('material_type_id', e)} value={data.material_type_id}>
                    <SelectTrigger tabIndex={5} className="truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select a material type" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[calc(100vw-2rem)]">
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Type</SelectLabel>
                            {materialTypes.map((materialType: MaterialType) => {
                                return (
                                    <SelectItem key={materialType.id} value={materialType.id.toString()}>
                                        {materialType.code} - {materialType.description}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FieldError>{errors.material_type_id}</FieldError>
            </Field>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    label={buttonLabel}
                    disabled={processing || data.code == '' || data.name == ''}
                    tabIndex={6}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
