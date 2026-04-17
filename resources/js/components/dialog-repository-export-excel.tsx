import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Sheet } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox } from './ui/checkbox';

interface DialogRepositoryExportExcelProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    extensions?: string[];
}

export default function DialogRepositoryExportExcel({ open, setOpen, extensions }: DialogRepositoryExportExcelProps) {
    const [processing, setProcessing] = React.useState<boolean>(false);

    const { data, setData } = useForm({
        extension: extensions as string[],
    });

    const handleExtensionChange = (ext: string, checked: boolean) => {
        if (checked) {
            setData('extension', [...data.extension, ext]);
        } else {
            setData(
                'extension',
                data.extension.filter((item) => item !== ext),
            );
        }
    };

    const handleExport = () => {
        setProcessing(true);
        const params = new URLSearchParams();

        data.extension.forEach((id) => {
            params.append('extension[]', id.toString());
        });

        const baseUrl = route('repositories.export');
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
                            Configure your Excel report. Select the extension to filter the document to be exported.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="no-scrollbar max-h-[50vh] overflow-y-auto">
                        {/* STATUS */}
                        <FieldSet className="gap-5">
                            <FieldLegend className="mb-2" variant="label">
                                Document Extension:
                            </FieldLegend>
                            <FieldDescription>Select the extensions.</FieldDescription>
                            <FieldGroup className="gap-3">
                                {extensions &&
                                    extensions?.map((ext: string) => {
                                        return (
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => handleExtensionChange(ext, checked)}
                                                    id={ext}
                                                    checked={data.extension.includes(ext)}
                                                    name={ext}
                                                    defaultChecked
                                                />
                                                <Label htmlFor={ext} className="font-normal">
                                                    {ext}
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
