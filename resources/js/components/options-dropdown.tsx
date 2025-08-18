import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

import React from 'react';

type OptionsDropdownProps = {
    children: React.ReactNode;
    trigger?: React.ReactNode;
    className?: string;
};

export default function OptionsDropdown({ children, trigger, className }: OptionsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{trigger ? trigger : <MoreVertical />}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={className}>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
