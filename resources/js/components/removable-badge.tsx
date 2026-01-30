import { X } from 'lucide-react';
import { Badge } from './ui/badge';

interface RemovableBadgeProps {
    label: string;
    onView: () => void;
    onRemove: () => void;
}

export default function RemovableBadge({ label, onView, onRemove }: RemovableBadgeProps) {
    return (
        <div className="inline-flex h-6 items-stretch">
            <Badge
                variant="secondary"
                className="flex cursor-pointer items-center rounded-r-none border-r-0 px-2 py-0 text-[12px] font-medium"
                onClick={onView}
            >
                {label}
            </Badge>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="flex items-center justify-center rounded-r bg-red-500 px-1.5 text-white transition-colors hover:bg-red-700"
            >
                <X className="h-3 w-3" strokeWidth={3} />
            </button>
        </div>
    );
}
