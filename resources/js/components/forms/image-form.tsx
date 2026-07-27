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
                onRemoveImage={(index: number) => {
                    const newImages = data.images?.filter((_, idx) => idx !== index) || null;
                    setData('images', newImages && newImages.length > 0 ? newImages : null);
                }}
            />

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
