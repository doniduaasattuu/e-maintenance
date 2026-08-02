import RequiredLabel from '@/components/required-label';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Info, UploadCloud, X } from 'lucide-react';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import CompressingDescription from './compressing-description';

interface PhotoInputProps {
    variant?: 'dropzone' | 'standard';
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

export default function PhotoInput({
    variant = 'dropzone',
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
}: PhotoInputProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Mencegah browser membuka file secara default
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled && !isCompressing) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled || isCompressing) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && fileInputRef.current) {
            // Pasang file dropped ke element input native
            fileInputRef.current.files = e.dataTransfer.files;

            // Buat mock ChangeEvent agar fungsi onFileChange bawaan Anda dapat memprosesnya
            const event = {
                target: fileInputRef.current,
                currentTarget: fileInputRef.current,
            } as ChangeEvent<HTMLInputElement>;

            onFileChange(event);
        }
    };

    const triggerFileInput = () => {
        if (!disabled && !isCompressing) {
            fileInputRef.current?.click();
        }
    };

    return (
        <Field>
            <FieldLabel htmlFor="images">
                Photos
                {required && <RequiredLabel />}
            </FieldLabel>

            {/* Container Interaktif Dropzone */}

            {variant === 'standard' ? (
                <Input
                    tabIndex={tabIndex}
                    type="file"
                    id="images"
                    multiple
                    ref={fileInputRef}
                    disabled={disabled || isCompressing}
                    onChange={onFileChange}
                    accept="image/jpg, image/jpeg, image/png, image/webp"
                />
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 ${
                        isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-input hover:border-accent-foreground/30 bg-background'
                    } ${(disabled || isCompressing) && 'cursor-not-allowed opacity-50'}`}
                >
                    {/* Input File Bawaan Shadcn UI (Disembunyikan secara visual) */}
                    <Input
                        tabIndex={tabIndex}
                        type="file"
                        id="images"
                        multiple
                        ref={fileInputRef}
                        disabled={disabled || isCompressing}
                        onChange={onFileChange}
                        accept="image/jpg, image/jpeg, image/png, image/webp"
                        className="sr-only"
                    />

                    {/* Konten UI Informasi Teks di dalam Kotak */}
                    <div className="selective-none pointer-events-none flex flex-col items-center justify-center gap-2">
                        <UploadCloud className={`size-6 ${isDragging ? 'text-primary animate-bounce' : 'text-muted-foreground'}`} />
                        <p className="text-sm">{isDragging ? 'Drop the image here!' : 'Drag & drop images here, or click to select'}</p>
                        <p className="text-muted-foreground text-xs">Supports jpg, jpeg, png, webp formats</p>
                    </div>
                </div>
            )}

            {/* Area Preview File Gambar */}
            {images && images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(images).map((file, index) => (
                        <div key={index} className="relative size-16 overflow-hidden rounded border bg-slate-100">
                            <img src={URL.createObjectURL(file)} alt="preview" className="size-full object-cover" />
                            {onRemoveImage && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Mencegah terbukanya file picker saat menghapus gambar
                                        onRemoveImage(index);
                                    }}
                                    className="absolute top-0 right-0 rounded-bl bg-red-500 p-0.5 text-white transition-colors hover:bg-red-600"
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
