import { Transition } from '@headlessui/react';
import { LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ButtonSubmitProps {
    processing?: boolean;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    tabIndex?: number | undefined;
    disabled: boolean;
    label?: string;
    recentlySuccessful?: boolean;
    showSuccessMessage?: boolean;
    successMessage?: string;
}

export default function ButtonSubmit({
    processing,
    variant,
    tabIndex,
    disabled,
    recentlySuccessful,
    showSuccessMessage = true,
    successMessage,
    label,
}: ButtonSubmitProps) {
    return (
        <div className="mt-2 flex items-center gap-4">
            <Button size={'sm'} variant={variant ?? 'default'} type="submit" disabled={disabled} tabIndex={tabIndex}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {label ?? 'Submit'}
            </Button>

            <Transition
                show={recentlySuccessful && showSuccessMessage}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                <p className="text-sm text-neutral-600">{successMessage ?? 'Updated'}</p>
            </Transition>
        </div>
    );
}
