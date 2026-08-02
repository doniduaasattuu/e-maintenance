import { Meta } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function cfl(word: string): string {
    const firstLetter = word.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = word.slice(1);
    const capitalizedWord = firstLetterCap + remainingLetters;
    return capitalizedWord;
}

export function formatCurrency(value: number, format: string = 'id-ID', currency: string = 'IDR') {
    return new Intl.NumberFormat(format, {
        style: 'currency',
        currency: currency,
    }).format(value);
}

export function removeOrigin(href: string): string {
    try {
        const url = new URL(href);
        return url.pathname;
    } catch (e: unknown) {
        console.error(e);
        return href;
    }
}

export function tableCaption(meta: Meta) {
    if (!meta || meta.total === 0) return 'Showing 0 to 0 of 0 results';

    const from = meta.from ?? 0;
    const to = meta.to ?? 0;
    const total = meta.total ?? 0;

    return `Showing ${from} to ${to} of ${total} results`;
}

export async function copyTextToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        toast.info('Copied to clipboard:', {
            description: text,
        });
    } catch (e) {
        if (e instanceof Error) {
            toast.error('Failed copied text to clipboard', {
                description: e.message,
            });
            return;
        }

        toast.error('Failed copied text to clipboard');
    }
}

export function formatDateIndonesia(date: number) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export default function truncateText(str: string, maxLength: number = 40) {
    if (str.length <= maxLength) {
        return str;
    }
    return str.slice(0, maxLength) + '...';
}

/**
 * Memotong nama file secara aman tanpa merusak ekstensi gambar agar muat di VARCHAR(255)
 */
export const limitFileName = (fileName: string, maxLength: number = 255): string => {
    if (fileName.length <= maxLength) return fileName;

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return fileName.substring(0, maxLength);
    }

    const extension = fileName.substring(lastDotIndex);
    const nameWithoutExt = fileName.substring(0, lastDotIndex);
    const allowedNameLength = maxLength - extension.length;

    return nameWithoutExt.substring(0, allowedNameLength) + extension;
};

interface HandleImageUploadOptions {
    e: ChangeEvent<HTMLInputElement>;
    compressFn: (file: File) => Promise<Blob>;
    setIsCompressing: (loading: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: (key: any, value: any) => void; // Menyesuaikan dengan Inertia useForm setData
    fieldKey?: string; // Default: 'images'
}

/**
 * Handler reusable untuk memproses upload gambar, kompresi, dan pembatasan nama file 255 karakter
 */
export const handleImageUploadHelper = async ({
    e,
    compressFn,
    setIsCompressing,
    setData,
    fieldKey = 'images',
}: HandleImageUploadOptions): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);

    try {
        const fileArray = Array.from(files);

        const compressionPromises = fileArray.map(async (file) => {
            // Jalankan fungsi kompresi eksternal yang di-passing
            const compressedBlob = await compressFn(file);

            // Batasi karakter nama file
            const safeName = limitFileName(file.name, 255);

            // Kembalikan ke objek File utuh dengan nama asli
            return new File([compressedBlob], safeName, {
                type: compressedBlob.type,
                lastModified: Date.now(),
            });
        });

        const compressedFiles = await Promise.all(compressionPromises);

        // Update state formulir Inertia
        setData(fieldKey, compressedFiles);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Compression helper failed:', error);
        }
    } finally {
        setIsCompressing(false);
    }
};
