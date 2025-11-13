import { useImageCompressor } from '@/hooks/use-image-compressor';
import { AxiosProgressEvent } from 'axios';
import { ChangeEvent, FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import InputDescription from '../input-description';
import InputError from '../input-error';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

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
}

export default function ImageForm({ submit, fileInputRef, processing, setData, progress, errors, data, recentlySuccessful }: ImageFormParams) {
    const compressImage = useImageCompressor();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            const compressed = await compressImage(file);
            setData('image', compressed);
        } catch (error) {
            console.error('Compression failed: ', error);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid w-full gap-2 sm:max-w-xs">
                <Label htmlFor="image">Upload</Label>
                <Input
                    className="mt-1"
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    disabled={processing}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp"
                />
                {progress && <Progress className="mt-1 h-1.5" value={progress.percentage} />}
                <InputError message={errors.image} />
                {data.image && data.image.size > 1 && (
                    <InputDescription message={`Compressed to ${(data.image?.size / 1024 / 1024).toFixed(2)} MB`} />
                )}
            </div>
            <ButtonSubmit
                disabled={processing || fileInputRef.current == null || data.image == null}
                showSuccessMessage={true}
                successMessage="Saved"
                recentlySuccessful={recentlySuccessful}
            />
        </form>
    );
}
