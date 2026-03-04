import { cn } from '@/lib/utils';

export default function RequiredLabel({ className }: { className?: string }) {
    return <span className={cn('text-red-400', className)}>*</span>;
}
