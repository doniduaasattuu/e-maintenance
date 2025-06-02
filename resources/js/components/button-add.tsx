import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface ButtonAddProps {
    route: string;
    label?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
}

export default function ButtonAdd({ route, label, variant }: ButtonAddProps) {
    return (
        <Link href={route}>
            <Button variant={variant ?? 'outline'}>
                <Plus /> {label ?? 'New'}
            </Button>
        </Link>
    );
}
