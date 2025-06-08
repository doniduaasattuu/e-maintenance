import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface ButtonAddProps {
    route: string;
    label?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    tabIndex?: number;
}

export default function ButtonAdd({ route, label, variant, tabIndex }: ButtonAddProps) {
    const isMobile = useIsMobile();

    return (
        <Link tabIndex={tabIndex} href={route}>
            <Button variant={variant ?? 'outline'}>
                <Plus /> {isMobile ? 'New' : (label ?? 'New')}
            </Button>
        </Link>
    );
}
