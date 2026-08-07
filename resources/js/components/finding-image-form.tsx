import { useImageCompressor } from '@/hooks/use-image-compressor';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, handleImageUploadHelper } from '@/lib/utils';
import { Finding, Image } from '@/types';
import { useForm } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import ButtonSubmit from './button-submit';
import PhotoInput from './photo-input';

interface Props {
    finding: Finding;
    className?: string;
    category: 'before' | 'after';
}

interface FindingImageForm {
    images: Image[] | null;
}

export default function FindingImageForm({ finding, className, category }: Props) {
    type FindingImageForm = {
        images: File[] | null;
        category: 'before' | 'after';
    };

    const isMobile = useIsMobile();

    const { data, post, setData, processing, errors, reset, recentlySuccessful } = useForm<FindingImageForm>({
        images: null,
        category: category,
    });

    const compressImage = useImageCompressor();
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleImageUploadHelper({
            e,
            compressFn: compressImage,
            setIsCompressing,
            setData,
            fieldKey: 'images',
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('findings.images.update', finding.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('images');
            },
        });
    };

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
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
                label="Upload"
                successMessage="Uploaded"
                recentlySuccessful={recentlySuccessful}
            />
        </form>
    );
}
