import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Sheet } from 'lucide-react';
import { Button } from './ui/button';

interface ButtonExportProps {
    label?: string;
    title?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    tabIndex?: number;
    size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
    onClick?: () => void;
    className?: string;
}

export default function ButtonExport({ label, title, variant, tabIndex, size, onClick, className }: ButtonExportProps) {
    const isMobile = useIsMobile();

    return (
        <Button
            onClick={onClick}
            title={title ?? 'Export to Excel'}
            size={size ?? 'sm'}
            variant={variant ?? 'outline'}
            tabIndex={tabIndex}
            className={cn('text-muted-foreground', className)}
        >
            <Sheet />
            {!isMobile && (label ?? 'Export')}
        </Button>
    );
}
