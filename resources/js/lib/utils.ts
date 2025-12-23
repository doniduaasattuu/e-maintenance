import { Meta } from '@/types';
import { type ClassValue, clsx } from 'clsx';
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
