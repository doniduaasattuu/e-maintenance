import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export default function InputDescription({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p {...props} className={cn('text-sm text-gray-600 dark:text-gray-400', className)}>
            {message}
        </p>
    ) : null;
}
