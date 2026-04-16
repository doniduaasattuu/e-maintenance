import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronDownIcon, LoaderCircle, Sheet } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DialogFunctionalLocationExportExcelProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DialogFunctionalLocationExportExcel({ open, setOpen }: DialogFunctionalLocationExportExcelProps) {
    const [processing, setProcessing] = React.useState<boolean>(false);
    const date = new Date();
    const [startDate, setStartDate] = React.useState<Date>(new Date(date.setMonth(date.getMonth() - 3)));
    const [endDate, setEndDate] = React.useState<Date>(new Date());

    const { data, setData } = useForm({
        start_date: '',
        end_date: '',
    });

    React.useEffect(() => {
        if (startDate) setData('start_date', format(startDate, 'yyyy-MM-dd'));
    }, [setData, startDate]);

    React.useEffect(() => {
        if (endDate) setData('end_date', format(endDate, 'yyyy-MM-dd'));
    }, [endDate, setData]);

    const handleExport = () => {
        setProcessing(true);
        const params = new URLSearchParams();

        if (data.start_date) params.append('start_date', data.start_date);
        if (data.end_date) params.append('end_date', data.end_date);

        const baseUrl = route('functional-locations.export');
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
                            Configure your Excel report. Select the date range and status to filter the functional location to be exported.
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
                    </FieldGroup>
                    <DialogFooter>
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
