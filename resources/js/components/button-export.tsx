import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet } from 'lucide-react';
import { Button } from './ui/button';

interface ButtonExportProps {
    label?: string;
    title?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    tabIndex?: number;
    size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
    onClick?: () => void;
}

export default function ButtonExport({ label, title, variant, tabIndex, size, onClick }: ButtonExportProps) {
    const isMobile = useIsMobile();

    return (
        <Button
            onClick={onClick}
            title={title ?? 'Export to Excel'}
            size={size ?? 'sm'}
            variant={variant ?? 'outline'}
            tabIndex={tabIndex}
            className="text-muted-foreground"
        >
            <Sheet />
            {!isMobile && (label ?? 'Export')}
        </Button>
    );
}
