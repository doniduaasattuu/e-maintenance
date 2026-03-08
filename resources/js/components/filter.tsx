import { Button } from '@/components/ui/button';
import { Command, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { Settings2 } from 'lucide-react';
import * as React from 'react';
import TextLink from './text-link';

interface FilterProps {
    children: React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function Filter({ children, open, setOpen, className }: FilterProps) {
    const isMobile = useIsMobile();
    const align = isMobile ? 'end' : 'start';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open}>
                    <Settings2 />
                </Button>
            </PopoverTrigger>
            <PopoverContent align={align} className="p-0">
                <Command className={className}>
                    <CommandList>{children}</CommandList>
                    <CommandSeparator />
                    <TextLink
                        className="text-muted-foreground cursor-pointer py-2 text-center text-sm hover:text-blue-500"
                        href={window.location.pathname}
                    >
                        Reset filter
                    </TextLink>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
