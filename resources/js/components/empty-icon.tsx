import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty';

export default function EmptyIcon({ className }: { className?: string }) {
    return (
        <Empty className={cn('h-100', className)}>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Leaf />
                </EmptyMedia>
                <EmptyTitle>No data</EmptyTitle>
                <EmptyDescription>No data found</EmptyDescription>
            </EmptyHeader>
            <EmptyContent></EmptyContent>
        </Empty>
    );
}
