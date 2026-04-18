import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { MaterialType } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Sheet } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import FunctionalLocationSelect from './functional-location-select';
import { Checkbox } from './ui/checkbox';

interface DialogMaterialExportExcelProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    materialTypes?: {
        data: MaterialType[];
    };
}

export default function DialogMaterialExportExcel({ open, setOpen, materialTypes }: DialogMaterialExportExcelProps) {
    const [processing, setProcessing] = React.useState<boolean>(false);

    const selectedType = materialTypes?.data.map((s: MaterialType) => {
        return s.id;
    });

    const { data, setData } = useForm({
        type_ids: selectedType as number[],
        functional_location_id: '',
    });

    const handleTypeChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('type_ids', [...data.type_ids, id]);
        } else {
            setData(
                'type_ids',
                data.type_ids.filter((item) => item !== id),
            );
        }
    };

    const handleExport = () => {
        setProcessing(true);
        const params = new URLSearchParams();

        data.type_ids.forEach((id) => {
            params.append('type_ids[]', id.toString());
        });

        if (data.functional_location_id) {
            params.append('functional_location_id', data.functional_location_id);
        }

        const baseUrl = route('materials.export');
        const finalUrl = `${baseUrl}?${params.toString()}`;
        window.location.href = finalUrl;
        setTimeout(() => {
            setProcessing(false);
            setOpen(false);
        }, 3000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full sm:max-w-lg">
                <div className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Export to Excel</DialogTitle>
                        <DialogDescription>
                            Configure your Excel report. Select the material type to filter the material to be exported.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="no-scrollbar max-h-[50vh] overflow-y-auto">
                        {/* FUNCTIONAL LOCATION */}
                        <Field className="w-full">
                            <FieldLabel>Functional Location</FieldLabel>
                            <FunctionalLocationSelect
                                value={data.functional_location_id}
                                processing={processing}
                                tabIndex={4}
                                id="functional_location_id"
                                onChange={(val) => setData('functional_location_id', val ? val.toString() : '')}
                            />
                            <FieldDescription>Enter functional location to get all materials in each equipment.</FieldDescription>
                        </Field>

                        {/* STATUS */}
                        <FieldSet className="gap-5">
                            <FieldLegend className="mb-2" variant="label">
                                Material Type:
                            </FieldLegend>
                            <FieldDescription>Select the material type.</FieldDescription>
                            <FieldGroup className="gap-3">
                                {materialTypes?.data &&
                                    materialTypes?.data.map((type: MaterialType) => {
                                        return (
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => handleTypeChange(type.id, checked)}
                                                    id={type.code}
                                                    checked={data.type_ids.includes(type.id)}
                                                    name={type.code}
                                                    defaultChecked
                                                />
                                                <Label htmlFor={type.code} className="truncate font-normal">
                                                    {`${type.code} - ${type.description}`}
                                                </Label>
                                            </Field>
                                        );
                                    })}
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button size={'sm'} variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button disabled={processing} size={'sm'} onClick={handleExport} type="submit">
                            {processing ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Generating..
                                </>
                            ) : (
                                <>
                                    <Sheet />
                                    Export
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
