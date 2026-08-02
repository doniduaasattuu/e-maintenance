import { useImageCompressor } from '@/hooks/use-image-compressor';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, handleImageUploadHelper } from '@/lib/utils';
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
    const isMobile = useIsMobile();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleImageUploadHelper({
            e,
            compressFn: compressImage,
            setIsCompressing,
            setData,
            fieldKey: 'images',
        });
    };

    return (
        <form onSubmit={submit} className={cn(className, 'space-y-6')}>
            <PhotoInput
                variant={isMobile ? 'standard' : 'dropzone'}
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
