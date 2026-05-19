import { useImageCompressor } from '@/hooks/use-image-compressor';
import { Finding, Image } from '@/types';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useRef, useState } from 'react';
import ButtonSubmit from './button-submit';
import CompressingDescription from './compressing-description';
import { Field, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';

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
        images?: File[] | null;
        category: 'before' | 'after';
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, post, setData, processing, errors, reset, recentlySuccessful } = useForm<FindingImageForm>({
        images: null,
        category: category,
    });

    const compressImage = useImageCompressor();
    const [isCompressing, setIsCompressing] = useState<boolean>(false);

    const handleRemoveImage = (indexToRemove: number) => {
        if (!data.images) return;

        // 1. Revoke the object URL of the image being removed to prevent memory leaks
        URL.revokeObjectURL(URL.createObjectURL(data.images[indexToRemove]));

        // 2. Filter out the image by its index and update Inertia form state
        const updatedImages = data.images.filter((_, index) => index !== indexToRemove);

        // 3. Update state (set to null if array is empty to match your type definition)
        setData('images', updatedImages.length > 0 ? updatedImages : null);
    };

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
        <form onSubmit={submit} className="space-y-6">
            <Field className={className}>
                <FieldLabel htmlFor="images">Upload</FieldLabel>
                <Input
                    multiple
                    type="file"
                    id="images"
                    ref={fileInputRef}
                    disabled={processing}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp"
                />

                {data.images && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {data.images.map((image, index) => (
                            <div className="relative size-16 overflow-hidden rounded border bg-slate-100">
                                <img src={URL.createObjectURL(image)} alt="preview" className="size-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 rounded-bl bg-red-500 text-white"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <FieldError>{errors.images}</FieldError>
                {isCompressing && <CompressingDescription />}
            </Field>
            <ButtonSubmit
                processing={processing}
                disabled={processing || fileInputRef.current == null || data.images == null}
                showSuccessMessage={true}
                label="Upload"
                successMessage="Uploaded"
                recentlySuccessful={recentlySuccessful}
            />
        </form>
    );
}
