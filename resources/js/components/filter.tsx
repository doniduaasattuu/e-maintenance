import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { router } from '@inertiajs/react';
import { Settings2 } from 'lucide-react';

interface FilterProps {
    children: React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Filter({ children, open, setOpen }: FilterProps) {
    const isMobile = useIsMobile();
    const align = isMobile ? 'center' : 'start';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open}>
                    <Settings2 />
                </Button>
            </PopoverTrigger>
            <PopoverContent align={align} className="w-[200px] justify-between p-0 sm:w-full">
                <Command>
                    <CommandList>{children}</CommandList>
                    <CommandSeparator />
                    <p
                        className="text-muted-foreground cursor-pointer py-1 text-center text-sm hover:text-blue-500"
                        onClick={() => {
                            router.get(window.location.pathname);
                        }}
                    >
                        Reset
                    </p>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
