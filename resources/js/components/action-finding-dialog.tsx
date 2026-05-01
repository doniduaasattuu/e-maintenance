import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toDateString } from '@/hooks/use-date';
import { useImageCompressor } from '@/hooks/use-image-compressor';
import { Finding } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronDownIcon, Info } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from 'react';
import ButtonSubmit from './button-submit';
import CompressingDescription from './compressing-description';
import RequiredLabel from './required-label';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Textarea } from './ui/textarea';

interface ActionFindingDialogProps {
    finding: Finding;
    children: React.ReactNode | undefined;
}

type UploadImageData = {
    rectification_action?: string;
    images?: File[] | null;
    closed_at: string;
};

export function ActionFindingDialog({ children, finding }: ActionFindingDialogProps) {
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const compressImage = useImageCompressor();
    const [errorCompression, setErrorCompression] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

    const [closedDate, setClosedDate] = useState<Date | undefined>(new Date());
    const [closedTime, setClosedTime] = useState<string | undefined>(closedDate?.toTimeString().slice(0, 8));
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<UploadImageData>>({
        rectification_action: '',
        images: null,
        closed_at: closedDate ? toDateString(closedDate) + ' ' + closedTime : `${toDateString(new Date())} ${new Date().toTimeString().slice(0, 8)}`,
    });

    useEffect(() => {
        if (closedDate && closedTime) {
            const datePart = format(closedDate, 'yyyy-MM-dd');
            const timePart = closedTime.split(':').length === 2 ? `${closedTime}:00` : closedTime;

            const finalDateTime = `${datePart} ${timePart}`;

            console.log('Syncing to form:', finalDateTime); // Cek log di sini
            setData('closed_at', finalDateTime);
        }
    }, [closedDate, closedTime, setData]);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        setIsCompressing(true);

        try {
            const fileArray = Array.from(files);

            const compressionPromises = fileArray.map(async (file) => {
                return await compressImage(file);
            });

            const compressedFiles = await Promise.all(compressionPromises);

            setData('images', compressedFiles);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Compression failed: ', error);
                setErrorCompression(error.message);
            }
        } finally {
            setIsCompressing(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('findings.images.store', finding.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset('rectification_action', 'images');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-6">
                    <DialogHeader className="space-y-2">
                        <DialogTitle>Upload Completion Evidence</DialogTitle>
                        <DialogDescription>
                            To finalize this finding and mark it as <strong>Review</strong>, please upload the "After" photos as proof of resolution.
                            Ensure the images clearly show the corrected condition of the equipment.
                        </DialogDescription>
                    </DialogHeader>

                    <Field>
                        <FieldLabel htmlFor="rectification_action">
                            Rectification Action
                            <RequiredLabel />
                        </FieldLabel>
                        <Textarea
                            className="text-sm"
                            disabled={processing}
                            tabIndex={1}
                            id="rectification_action"
                            onChange={(val: React.ChangeEvent<HTMLTextAreaElement>) => setData('rectification_action', val.target.value)}
                            value={data.rectification_action}
                            placeholder="Explain how the issue was fixed (e.g., 'Cleaned the electrical terminals, tightened all loose bolts to 50Nm, and verified stable temperature via thermal scan.')"
                        />
                        <FieldError>{errors.rectification_action}</FieldError>
                    </Field>

                    <div className="flex justify-between gap-2">
                        <Field>
                            <FieldLabel htmlFor="closed_date">
                                Closed Date
                                <RequiredLabel />
                            </FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button tabIndex={2} size={'sm'} variant="outline" id="closed_date" className="justify-between font-normal">
                                        {closedDate ? format(closedDate, 'PPP') : 'Select date'}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="max-w-56.5 overflow-hidden p-0" align="start">
                                    <Calendar
                                        className="w-full"
                                        mode="single"
                                        selected={closedDate}
                                        captionLayout="dropdown"
                                        defaultMonth={closedDate}
                                        onSelect={(date) => {
                                            if (date) {
                                                setClosedDate(date);
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FieldError>{errors.closed_at}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="closed_time">
                                Closed Time
                                <RequiredLabel />
                            </FieldLabel>
                            <Input
                                tabIndex={3}
                                type="time"
                                id="closed_time"
                                step="1"
                                value={closedTime}
                                onChange={(time) => {
                                    console.log(time.target.value);
                                    setClosedTime(time.target.value);
                                }}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="images">
                            Photos
                            <RequiredLabel />
                        </FieldLabel>
                        <Input
                            tabIndex={4}
                            type="file"
                            id="images"
                            multiple
                            ref={fileInputRef}
                            disabled={processing || isCompressing}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.webp"
                        />
                        <FieldError>{errors.images || errorCompression}</FieldError>
                        <FieldDescription>
                            <div className="space-y-1">
                                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                    <Info className="text-muted-foreground size-3 shrink-0" />
                                    Upload between 1 to 5 photos.
                                </div>
                                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                    <Info className="text-muted-foreground size-3 shrink-0" />
                                    Images will be automatically compressed to optimize upload speed and storage.
                                </div>
                            </div>
                        </FieldDescription>
                        {isCompressing && <CompressingDescription />}
                    </Field>
                    <DialogFooter>
                        <ButtonSubmit
                            tabIndex={5}
                            processing={processing}
                            disabled={processing || isCompressing || !setData || data.rectification_action.length < 10 || data.images == null}
                            label="Upload"
                            successMessage="Uploaded"
                            recentlySuccessful={recentlySuccessful}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
