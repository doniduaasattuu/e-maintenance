import RequiredLabel from '@/components/required-label';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Info, X } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import CompressingDescription from './compressing-description';

interface FindingPhotoInputProps {
    images: File[] | null;
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage?: (index: number) => void;
    error?: string;
    isCompressing?: boolean;
    disabled?: boolean;
    tabIndex?: number;
    required?: boolean;
    maxFiles?: number;
    minFiles?: number;
}

export default function FindingPhotoInput({
    images,
    onFileChange,
    onRemoveImage,
    error,
    isCompressing = false,
    disabled = false,
    tabIndex,
    required = true,
    maxFiles = 5,
    minFiles = 1,
}: FindingPhotoInputProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Field>
            <FieldLabel htmlFor="images">
                Photos
                {required && <RequiredLabel />}
            </FieldLabel>

            <Input
                tabIndex={tabIndex}
                type="file"
                id="images"
                multiple
                ref={fileInputRef}
                disabled={disabled || isCompressing}
                onChange={onFileChange}
                accept=".jpg,.jpeg,.png,.webp"
                className="cursor-pointer"
            />

            {images && images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {Array.from(images).map((file, index) => (
                        <div key={index} className="relative size-16 overflow-hidden rounded border bg-slate-100">
                            <img src={URL.createObjectURL(file)} alt="preview" className="size-full object-cover" />
                            {onRemoveImage && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(index)}
                                    className="absolute top-0 right-0 rounded-bl bg-red-500 text-white"
                                >
                                    <X className="size-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <FieldError>{error}</FieldError>

            <FieldDescription>
                <div className="mt-2 space-y-1">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Info className="size-3 shrink-0" />
                        Upload between {minFiles} to {maxFiles} photos.
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Info className="size-3 shrink-0" />
                        Images will be automatically compressed to optimize speed.
                    </div>
                </div>
            </FieldDescription>

            {isCompressing && <CompressingDescription />}
        </Field>
    );
}
