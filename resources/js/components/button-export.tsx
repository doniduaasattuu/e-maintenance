import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Sheet } from './ui/sheet';

interface ButtonExportProps {
    label?: string;
    title?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    tabIndex?: number;
    onClick?: () => void;
}

export default function ButtonExport({ label, title, variant, tabIndex, onClick }: ButtonExportProps) {
    const isMobile = useIsMobile();

    return (
        <Button onClick={onClick} title={title ?? 'Export to Excel'} size={'sm'} variant={variant} tabIndex={tabIndex}>
            <Sheet />
            {!isMobile && (label ?? 'Export')}
        </Button>
    );
}
