import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { EquipmentClass, EquipmentStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Sheet } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox } from './ui/checkbox';

interface DialogEquipmentExportExcelProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    equipmentClasses?: {
        data: EquipmentClass[];
    };
    equipmentStatuses?: {
        data: EquipmentStatus[];
    };
}

export default function DialogEquipmentExportExcel({ open, setOpen, equipmentClasses, equipmentStatuses }: DialogEquipmentExportExcelProps) {
    const [processing, setProcessing] = React.useState<boolean>(false);

    const selectedClass = equipmentClasses?.data.map((c: EquipmentClass) => {
        return c.id;
    });
    const selectedStatus = equipmentStatuses?.data.map((s: EquipmentStatus) => {
        return s.id;
    });

    const { data, setData } = useForm({
        start_date: '',
        end_date: '',
        class_ids: selectedClass as number[],
        status_ids: selectedStatus as number[],
    });

    const handleClassChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('class_ids', [...data.class_ids, id]);
        } else {
            setData(
                'class_ids',
                data.class_ids.filter((item) => item !== id),
            );
        }
    };

    const handleStatusChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('status_ids', [...data.status_ids, id]);
        } else {
            setData(
                'status_ids',
                data.status_ids.filter((item) => item !== id),
            );
        }
    };

    const handleExport = () => {
        setProcessing(true);
        const params = new URLSearchParams();

        if (data.start_date) params.append('start_date', data.start_date);
        if (data.end_date) params.append('end_date', data.end_date);

        data.status_ids.forEach((id) => {
            params.append('status_ids[]', id.toString());
        });

        data.class_ids.forEach((id) => {
            params.append('class_ids[]', id.toString());
        });

        const baseUrl = route('equipments.export');
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
                            Configure your Excel report. Select the equipment class and status to filter the equipment to be exported.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="no-scrollbar max-h-[50vh] overflow-y-auto">
                        {/* CLASS */}
                        <FieldSet className="gap-5">
                            <FieldLegend className="mb-2" variant="label">
                                Equipment Class:
                            </FieldLegend>
                            <FieldDescription>Select the equipment class.</FieldDescription>
                            <FieldGroup className="gap-3">
                                {equipmentClasses?.data &&
                                    equipmentClasses?.data.map((status: EquipmentClass) => {
                                        return (
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => handleClassChange(status.id, checked)}
                                                    id={status.name}
                                                    checked={data.class_ids.includes(status.id)}
                                                    name={status.name}
                                                    defaultChecked
                                                />
                                                <Label htmlFor={status.name} className="font-normal">
                                                    {status.name}
                                                </Label>
                                            </Field>
                                        );
                                    })}
                            </FieldGroup>
                        </FieldSet>

                        {/* STATUS */}
                        <FieldSet className="gap-5">
                            <FieldLegend className="mb-2" variant="label">
                                Equipment Status:
                            </FieldLegend>
                            <FieldDescription>Select the equipment status.</FieldDescription>
                            <FieldGroup className="gap-3">
                                {equipmentStatuses?.data &&
                                    equipmentStatuses?.data.map((status: EquipmentStatus) => {
                                        return (
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => handleStatusChange(status.id, checked)}
                                                    id={status.name}
                                                    checked={data.status_ids.includes(status.id)}
                                                    name={status.name}
                                                    defaultChecked
                                                />
                                                <Label htmlFor={status.name} className="font-normal">
                                                    {status.name}
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
