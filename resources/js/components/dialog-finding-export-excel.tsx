import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Department, Equipment, FindingPriority, FindingStatus, FunctionalLocation, WorkCenter } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronDownIcon, LoaderCircle, Sheet } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DialogFindingExportExcelProps {
    mode: 'standalone' | 'functional-location' | 'equipment';
    asset?: Equipment | FunctionalLocation;
    findingTypeCode?: 'AUD' | 'ABN';
    isArchived?: boolean;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    findingPriorities?: {
        data: FindingPriority[];
    };
    findingStatuses?: {
        data: FindingStatus[];
    };
    departments?: {
        data: Department[];
    };
    workCenters?: {
        data: WorkCenter[];
    };
}

export default function DialogFindingExportExcel({
    mode,
    asset,
    findingTypeCode,
    isArchived = false,
    open,
    setOpen,
    findingPriorities,
    findingStatuses,
    departments,
    workCenters,
}: DialogFindingExportExcelProps) {
    const [processing, setProcessing] = React.useState<boolean>(false);
    const date = new Date();
    const [startDate, setStartDate] = React.useState<Date>(new Date(date.setMonth(date.getMonth() - 3)));
    const [endDate, setEndDate] = React.useState<Date>(new Date());

    const selectedStatus =
        findingStatuses?.data && findingStatuses?.data?.length > 0
            ? findingStatuses?.data.map((status: FindingStatus) => {
                  return status.id;
              })
            : [];
    const selectedPriority =
        findingPriorities?.data && findingPriorities?.data?.length > 0
            ? findingPriorities?.data.map((priority: FindingPriority) => {
                  return priority.id;
              })
            : [];
    const selectedDepartments =
        departments?.data && departments?.data?.length > 0
            ? departments?.data.map((department: Department) => {
                  return department.id;
              })
            : [];
    const selectedWorkCenters =
        workCenters?.data && workCenters?.data?.length > 0
            ? workCenters?.data.map((workCenter: WorkCenter) => {
                  return workCenter.id;
              })
            : [];

    const { data, setData } = useForm({
        start_date: '',
        end_date: '',
        status_ids: selectedStatus as number[],
        department_ids: selectedDepartments as number[],
        work_center_ids: selectedWorkCenters as number[],
        priority_ids: selectedPriority as number[],
        type_code: findingTypeCode,
    });

    React.useEffect(() => {
        if (startDate) setData('start_date', format(startDate, 'yyyy-MM-dd'));
    }, [setData, startDate]);

    React.useEffect(() => {
        if (endDate) setData('end_date', format(endDate, 'yyyy-MM-dd'));
    }, [endDate, setData]);

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

    const handlePriorityChange = (id: number, checked: boolean) => {
        if (checked) {
            setData('priority_ids', [...data.priority_ids, id]);
        } else {
            setData(
                'priority_ids',
                data.priority_ids.filter((item) => item !== id),
            );
        }
    };

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

    function getEndpointFromCode(
        findingTypeCode?: 'AUD' | 'ABN',
    ): 'audits' | 'abnormalities' | 'findings.archived' | 'functional-locations.findings' | 'equipments.findings' {
        if (mode != 'standalone') {
            switch (mode) {
                case 'functional-location':
                    return 'functional-locations.findings';
                case 'equipment':
                    return 'equipments.findings';
            }
        }

        switch (findingTypeCode) {
            case 'AUD':
                return 'audits';
            case 'ABN':
                return 'abnormalities';
            default:
                return 'findings.archived';
        }
    }

    const handleExport = () => {
        setProcessing(true);
        const params = new URLSearchParams();

        if (data.start_date) params.append('start_date', data.start_date);
        if (data.end_date) params.append('end_date', data.end_date);

        data.status_ids.forEach((id) => {
            params.append('status_ids[]', id.toString());
        });

        data.department_ids.forEach((id) => {
            params.append('department_ids[]', id.toString());
        });

        data.priority_ids.forEach((id) => {
            params.append('priority_ids[]', id.toString());
        });

        if (mode === 'standalone' && data.type_code) {
            params.append('type_code', data.type_code);
        }

        if (asset && mode != 'standalone') {
            switch (mode) {
                case 'equipment':
                    params.append('equipment_id', `${asset.id}`);
                    break;
                case 'functional-location':
                    params.append('functional_location_id', `${asset.id}`);
                    break;
            }
        }

        const baseUrl = route(`${getEndpointFromCode(findingTypeCode)}.export`);
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
                            Configure your Excel report. Select the date range and status to filter the findings to be exported.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="no-scrollbar max-h-[50vh] overflow-y-auto">
                        {/* DATE */}
                        <div className="flex items-center justify-between gap-2">
                            {/* START DATE */}
                            <Field>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="start_date"
                                            variant="outline"
                                            data-empty={!startDate}
                                            className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
                                            size={'sm'}
                                        >
                                            {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[14.2rem] p-0" align="start">
                                        <Calendar
                                            required
                                            className="w-[14.2rem]"
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            defaultMonth={startDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </Field>
                            {/* END DATE */}
                            <Field>
                                <Label htmlFor="end_date">End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="end_date"
                                            variant="outline"
                                            data-empty={!endDate}
                                            className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
                                            size={'sm'}
                                        >
                                            {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[14.2rem] p-0" align="end">
                                        <Calendar
                                            required
                                            className="w-[14.2rem]"
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            defaultMonth={endDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </Field>
                        </div>

                        {mode == 'standalone' && (
                            <>
                                {!isArchived && (
                                    <>
                                        {/* STATUS */}
                                        <FieldSet className="gap-5">
                                            <FieldLegend className="mb-2" variant="label">
                                                Finding Status:
                                            </FieldLegend>
                                            <FieldDescription>Select the finding status.</FieldDescription>
                                            <FieldGroup className="gap-3">
                                                {findingStatuses?.data &&
                                                    findingStatuses?.data.map((status: FindingStatus, index: number) => {
                                                        return (
                                                            <Field key={index} orientation="horizontal">
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
                                    </>
                                )}

                                {/* DEPARTMENT */}
                                <FieldSet className="gap-5">
                                    <FieldLegend className="mb-2" variant="label">
                                        Department:
                                    </FieldLegend>
                                    <FieldDescription>Select the responsible departments.</FieldDescription>
                                    <FieldGroup className="gap-3">
                                        {departments?.data &&
                                            departments?.data.map((department: Department, index: number) => {
                                                return (
                                                    <Field key={index} orientation="horizontal">
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

                                {/* PRIORITY */}
                                <FieldSet className="gap-5">
                                    <FieldLegend className="mb-2" variant="label">
                                        Finding Priority:
                                    </FieldLegend>
                                    <FieldDescription>Select the priority of finding.</FieldDescription>
                                    <FieldGroup className="gap-3">
                                        {findingPriorities?.data &&
                                            findingPriorities?.data.map((priority: FindingPriority, index: number) => {
                                                return (
                                                    <Field key={index} orientation="horizontal">
                                                        <Checkbox
                                                            onCheckedChange={(checked: boolean) => handlePriorityChange(priority.id, checked)}
                                                            id={priority.label}
                                                            checked={data.priority_ids.includes(priority.id)}
                                                            name={priority.label}
                                                            defaultChecked
                                                        />
                                                        <Label htmlFor={priority.label} className="font-normal">
                                                            {priority.label}
                                                        </Label>
                                                    </Field>
                                                );
                                            })}
                                    </FieldGroup>
                                </FieldSet>

                                {/* Work Center */}
                                <FieldSet className="gap-5">
                                    <FieldLegend className="mb-2" variant="label">
                                        Work Center:
                                    </FieldLegend>
                                    <FieldDescription>Select Work Center.</FieldDescription>
                                    <FieldGroup className="gap-3">
                                        {workCenters?.data &&
                                            workCenters?.data.map((workCenter: WorkCenter, index: number) => {
                                                return (
                                                    <Field key={index} orientation="horizontal">
                                                        <Checkbox
                                                            onCheckedChange={(checked: boolean) => handleWorkCenterChange(workCenter.id, checked)}
                                                            id={workCenter.code}
                                                            checked={data.work_center_ids.includes(workCenter.id)}
                                                            name={workCenter.code}
                                                            defaultChecked
                                                        />
                                                        <Label htmlFor={workCenter.name} className="font-normal">
                                                            {workCenter.name}
                                                        </Label>
                                                    </Field>
                                                );
                                            })}
                                    </FieldGroup>
                                </FieldSet>
                            </>
                        )}
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
