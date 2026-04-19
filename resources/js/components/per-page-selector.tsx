import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

interface PerPageSelectorProps {
    value: string;
}

const options = ['10', '25', '50', '100', '250'];

export function PerPageSelector({ value }: PerPageSelectorProps) {
    const handleValueChange = (newValue: string) => {
        const params = new URLSearchParams(window.location.search);

        params.set('per_page', newValue);
        params.set('page', '1');

        router.get(
            `${window.location.pathname}?${params.toString()}`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger className="w-17.5">
                <SelectValue placeholder={value} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel className="text-muted-foreground">Per page</SelectLabel>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
