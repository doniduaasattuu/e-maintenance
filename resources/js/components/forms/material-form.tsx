import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialType, Unit } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';

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
    units: Unit[];
    materialTypes: MaterialType[];
}

export type MaterialFormData = {
    code: string;
    name: string;
    price: string | null;
    unit_id: string | undefined;
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
    units,
    materialTypes,
}: MaterialFormProps) {
    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>

                <Input
                    tabIndex={1}
                    id="code"
                    type="numeric"
                    className="mt-1 block w-full"
                    value={data.code}
                    autoFocus
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    placeholder="10018891"
                    required
                    disabled={processing}
                    autoComplete="code"
                />

                <InputError message={errors.code} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>

                <Input
                    tabIndex={2}
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="BEARING NU"
                    required
                    disabled={processing}
                    autoComplete="name"
                />

                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>

                <Input
                    tabIndex={3}
                    id="price"
                    className="mt-1 block w-full"
                    value={data.price?.toString()}
                    onChange={(e) => setData('price', e.target.value)}
                    placeholder="50000"
                    required
                    type="numeric"
                    disabled={processing}
                    autoComplete="price"
                />

                <InputError message={errors.price} />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select disabled={processing} onValueChange={(e) => setData('unit_id', e)} value={data.unit_id}>
                    <SelectTrigger tabIndex={4} className="mt-1 truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Unit</SelectLabel>
                            {units.map((unit: Unit) => {
                                return (
                                    <SelectItem key={unit.id} value={unit.id.toString()}>
                                        {unit.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <InputError message={errors.unit_id} />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="material_type">Type</Label>
                <Select disabled={processing} onValueChange={(e) => setData('material_type_id', e)} value={data.material_type_id}>
                    <SelectTrigger tabIndex={5} className="mt-1 truncate overflow-hidden whitespace-nowrap">
                        <SelectValue placeholder="Select a material type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-muted-foreground">Type</SelectLabel>
                            {materialTypes.map((materialType: MaterialType) => {
                                return (
                                    <SelectItem key={materialType.id} value={materialType.id.toString()}>
                                        {materialType.code}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <InputError message={errors.material_type_id} />
            </div>

            {canSubmit && (
                <ButtonSubmit
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
