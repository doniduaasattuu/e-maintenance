import { useImageCompressor } from '@/hooks/use-image-compressor';
import { AxiosProgressEvent } from 'axios';
import { Check } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import ButtonSubmit from '../button-submit';
import CompressingDescription from '../compressing-description';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface ImageFormParams {
    submit: FormEventHandler;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    progress: AxiosProgressEvent | null;
    errors: Partial<Record<'image', string>>;
    data: {
        image?: File | null;
    };
    recentlySuccessful: boolean;
    className?: string;
}

export default function ImageForm({ submit, fileInputRef, processing, setData, errors, data, recentlySuccessful, className }: ImageFormParams) {
    const compressImage = useImageCompressor();
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        setIsCompressing(true);

        try {
            const compressed = await compressImage(file);
            setData('image', compressed);
        } catch (error) {
            console.error('Compression failed: ', error);
        } finally {
            setIsCompressing(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Field className={className}>
                <FieldLabel htmlFor="image">Upload</FieldLabel>
                <Input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    disabled={processing}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp"
                    capture="environment"
                />

                {data.image && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        <div className="relative size-16 overflow-hidden rounded border bg-slate-100">
                            <img src={URL.createObjectURL(data.image)} alt="preview" className="size-full object-cover" />
                        </div>
                    </div>
                )}

                <FieldError>{errors.image}</FieldError>

                {data.image && data.image.size > 1 && (
                    <FieldDescription className="flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        {`Compressed to ${(data.image?.size / 1024 / 1024).toFixed(2)} MB`}
                    </FieldDescription>
                )}
                {isCompressing && <CompressingDescription />}
            </Field>
            <ButtonSubmit
                processing={processing}
                disabled={processing || fileInputRef.current == null || data.image == null}
                showSuccessMessage={true}
                successMessage="Saved"
                recentlySuccessful={recentlySuccessful}
            />
        </form>
    );
}
