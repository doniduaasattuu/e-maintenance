import { Button } from '@/components/ui/button';
import { Command, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { router } from '@inertiajs/react';
import { FilterIcon } from 'lucide-react';
import * as React from 'react';

interface FilterProps {
    children: React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
    keys?: string[];
}

export default function Filter({ children, open, setOpen, className, keys }: FilterProps) {
    const isMobile = useIsMobile();
    const align = isMobile ? 'center' : 'start';

    const handleResetDate = () => {
        const searchParams = new URLSearchParams(window.location.search);

        keys?.forEach((key) => {
            searchParams.delete(key);
        });

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button className="text-muted-foreground px-2.5" size={'sm'} variant="outline" role="combobox" aria-expanded={open}>
                    <FilterIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent align={align} className="p-0">
                <Command className={className}>
                    <CommandList>{children}</CommandList>
                    <CommandSeparator />
                    <p onClick={handleResetDate} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                        Reset
                    </p>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
