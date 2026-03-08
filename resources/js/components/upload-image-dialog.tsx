import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useImageCompressor } from '@/hooks/use-image-compressor';
import { Finding } from '@/types';
import { useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useRef, useState } from 'react';
import ButtonSubmit from './button-submit';
import CompressingDescription from './compressing-description';
import RequiredLabel from './required-label';

interface UploadImageDialogProps {
    finding: Finding;
    children: React.ReactNode | undefined;
}

type UploadImageData = {
    images?: File[] | null;
};

export function UploadImageDialog({ children, finding }: UploadImageDialogProps) {
    const { setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<UploadImageData>>({
        images: null,
    });
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const compressImage = useImageCompressor();
    const [errorCompression, setErrorCompression] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

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
                reset('images');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={submit} className="space-y-6">
                    <DialogHeader className="space-y-2">
                        <DialogTitle>Upload Completion Evidence</DialogTitle>
                        <DialogDescription>
                            To finalize this finding and mark it as <strong>Closed</strong>, please upload the "After" photos as proof of resolution.
                            Ensure the images clearly show the corrected condition of the equipment.
                        </DialogDescription>
                    </DialogHeader>
                    <Field>
                        <FieldLabel htmlFor="images">
                            Photos
                            <RequiredLabel />
                        </FieldLabel>
                        <Input
                            tabIndex={1}
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
                                    Upload between 2 to 5 photos.
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
                            disabled={processing || isCompressing || !setData}
                            label="Upload"
                            successMessage="Uploaded"
                            recentlySuccessful={recentlySuccessful}
                        />
                        {/* <Button type="submit" disabled={processing || isCompressing || !setData}>
                           {processing ? 'Uploading...' : 'Upload'}
                        </Button> */}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
