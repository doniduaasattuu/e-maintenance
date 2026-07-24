import { useImageCompressor } from '@/hooks/use-image-compressor';
import { cn } from '@/lib/utils';
import { AxiosProgressEvent } from 'axios';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import ButtonSubmit from '../button-submit';
import PhotoInput from '../photo-input';

export type FormData = {
    images?: File[] | null;
};

interface ImageFormParams {
    submit: FormEventHandler;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    progress: AxiosProgressEvent | null;
    errors: Partial<Record<'images', string>>;
    data: Required<FormData>;
    recentlySuccessful: boolean;
    className?: string;
}

export default function ImageForm({ submit, processing, setData, errors, data, recentlySuccessful, className }: ImageFormParams) {
    const compressImage = useImageCompressor();
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
            }
        } finally {
            setIsCompressing(false);
        }
    };

    return (
        <form onSubmit={submit} className={cn(className, 'space-y-6')}>
            <PhotoInput
                images={data.images}
                onFileChange={handleFileChange}
                error={errors.images}
                isCompressing={isCompressing}
                disabled={processing}
                tabIndex={10}
            />
            {/* <Field className={className}>
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
            </Field> */}
            <ButtonSubmit
                processing={processing}
                disabled={processing || data.images == null}
                showSuccessMessage={true}
                successMessage="Saved"
                recentlySuccessful={recentlySuccessful}
            />
        </form>
    );
}
