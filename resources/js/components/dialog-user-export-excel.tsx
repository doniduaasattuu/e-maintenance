import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Department, Position, WorkCenter } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Sheet } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox } from './ui/checkbox';

interface DialogUserExportExcelProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    departments?: {
        data: Department[];
    };
    positions?: {
        data: Position[];
    };
    workCenters?: {
        data: WorkCenter[];
    };
}

export default function DialogUserExportExcel({ open, setOpen, departments, positions, workCenters }: DialogUserExportExcelProps) {
    const [processing, setProcessing] = React.useState<boolean>(false);

    const selectedDepartment = departments?.data.map((d: Department) => {
        return d.id;
    });
    const selectedPosition = positions?.data.map((p: Position) => {
        return p.id;
    });
    const selectedWorkCenter = workCenters?.data.map((w: WorkCenter) => {
        return w.id;
    });

    const { data, setData } = useForm({
        start_date: '',
        end_date: '',
        department_ids: selectedDepartment as number[],
        position_ids: selectedPosition as number[],
        work_center_ids: selectedWorkCenter as number[],
    });

    const handleDepartmentChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('department_ids', [...data.department_ids, id]);
        } else {
            setData(
                'department_ids',
                data.department_ids.filter((item) => item !== id),
            );
        }
    };

    const handlePositionChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('position_ids', [...data.position_ids, id]);
        } else {
            setData(
                'position_ids',
                data.position_ids.filter((item) => item !== id),
            );
        }
    };

    const handleWorkCenterChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('work_center_ids', [...data.work_center_ids, id]);
        } else {
            setData(
                'work_center_ids',
                data.work_center_ids.filter((item) => item !== id),
            );
        }
    };

    const handleExport = () => {
        setProcessing(true);
        const params = new URLSearchParams();

        if (data.start_date) params.append('start_date', data.start_date);
        if (data.end_date) params.append('end_date', data.end_date);

        data.department_ids.forEach((id) => {
            params.append('department_ids[]', id.toString());
        });

        data.position_ids.forEach((id) => {
            params.append('position_ids[]', id.toString());
        });

        data.work_center_ids.forEach((id) => {
            params.append('work_center_ids[]', id.toString());
        });

        const baseUrl = route('users.export');
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
                            Configure your Excel report. Select the department, position and work center to filter the user to be exported.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="no-scrollbar max-h-[50vh] overflow-y-auto">
                        {/* DEPARTMENT */}
                        <FieldSet className="gap-5">
                            <FieldLegend className="mb-2" variant="label">
                                Department:
                            </FieldLegend>
                            <FieldDescription>Select the departments.</FieldDescription>
                            <FieldGroup className="gap-3">
                                {departments?.data &&
                                    departments?.data.map((department: Department) => {
                                        return (
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => handleDepartmentChange(department.id, checked)}
                                                    id={department.code}
                                                    checked={data.department_ids.includes(department.id)}
                                                    name={department.code}
                                                    defaultChecked
                                                />
                                                <Label htmlFor={department.code} className="font-normal">
                                                    {department.name}
                                                </Label>
                                            </Field>
                                        );
                                    })}
                            </FieldGroup>
                        </FieldSet>

                        {/* POSITION */}
                        <FieldSet className="gap-5">
                            <FieldLegend className="mb-2" variant="label">
                                Position:
                            </FieldLegend>
                            <FieldDescription>Select the positions.</FieldDescription>
                            <FieldGroup className="gap-3">
                                {positions?.data &&
                                    positions?.data.map((position: Position) => {
                                        return (
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => handlePositionChange(position.id, checked)}
                                                    id={position.code}
                                                    checked={data.position_ids.includes(position.id)}
                                                    name={position.code}
                                                    defaultChecked
                                                />
                                                <Label htmlFor={position.code} className="font-normal">
                                                    {position.name}
                                                </Label>
                                            </Field>
                                        );
                                    })}
                            </FieldGroup>
                        </FieldSet>

                        {/* WORK CENTER */}
                        <FieldSet className="gap-5">
                            <FieldLegend className="mb-2" variant="label">
                                Work Center:
                            </FieldLegend>
                            <FieldDescription>Select the work centers.</FieldDescription>
                            <FieldGroup className="gap-3">
                                {workCenters?.data &&
                                    workCenters?.data.map((workCenter: WorkCenter) => {
                                        return (
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => handleWorkCenterChange(workCenter.id, checked)}
                                                    id={workCenter.code}
                                                    checked={data.work_center_ids.includes(workCenter.id)}
                                                    name={workCenter.code}
                                                    defaultChecked
                                                />
                                                <Label htmlFor={workCenter.code} className="font-normal">
                                                    {workCenter.name}
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
