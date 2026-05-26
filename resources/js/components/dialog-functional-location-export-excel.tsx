import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Sheet } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Input } from './ui/input';

interface DialogFunctionalLocationExportExcelProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DialogFunctionalLocationExportExcel({ open, setOpen }: DialogFunctionalLocationExportExcelProps) {
    const [processing, setProcessing] = React.useState<boolean>(false);

    const { data, setData } = useForm({
        area: '',
    });

    const handleExport = () => {
        setProcessing(true);
        const params = new URLSearchParams();

        params.append('area', data.area);

        const baseUrl = route('functional-locations.export');
        const finalUrl = `${baseUrl}?${params.toString()}`;
        window.location.href = finalUrl;
        // console.log(finalUrl);
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
                            Configure your Excel report. Input a area code or name to filter the functional location to be exported.
                        </DialogDescription>
                    </DialogHeader>
                    <Field>
                        <Label htmlFor="area">Area / Plant Section</Label>
                        <Input id="area" placeholder="FP-01-PM3-CUT-RWD" value={data.area} onChange={(e) => setData('area', e.target.value)} />
                        <FieldDescription>Leave blank to export all functional locations.</FieldDescription>
                    </Field>

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
