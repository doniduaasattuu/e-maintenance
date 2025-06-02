import { Button } from './ui/button';

interface ButtonSubmitProps {
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    tabIndex?: number | undefined;
    disabled: boolean;
    label: string;
}

export default function ButtonSubmit({ variant, tabIndex, disabled, label }: ButtonSubmitProps) {
    return (
        <Button variant={variant ?? 'default'} type="submit" className="mt-2" tabIndex={tabIndex} disabled={disabled}>
            {label ?? 'Submit'}
        </Button>
    );
}
