/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { router, usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';

export function DateRangePopover() {
    const isMobile = useIsMobile();
    const { props } = usePage<any>();
    const filters = props.filters as any;

    const [date, setDate] = useState<DateRange | undefined>({
        from: filters?.start_date ? parseISO(filters.start_date) : undefined,
        to: filters?.end_date ? parseISO(filters.end_date) : undefined,
    });

    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);

        if (range?.from && range?.to) {
            const searchParams = new URLSearchParams(window.location.search);

            searchParams.set('start_date', format(range.from, 'yyyy-MM-dd'));

            searchParams.set('end_date', format(range.to, 'yyyy-MM-dd'));

            router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }
    };

    const handleResetDate = () => {
        const searchParams = new URLSearchParams(window.location.search);

        searchParams.delete('start_date');
        searchParams.delete('end_date');

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });

        setDate({ from: undefined, to: undefined });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size={'sm'} variant="outline" id="date-picker-range" className="text-muted-foreground justify-start px-2.5 font-normal">
                    <CalendarIcon />
                    {!isMobile &&
                        (date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        ))}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-auto p-0 ${isMobile && 'mx-4'}`} align={isMobile ? 'center' : 'start'}>
                <div className="flex flex-col">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={isMobile ? 1 : 2}
                        className="w-60 md:w-120"
                    />
                    <p
                        onClick={handleResetDate}
                        className="text-muted-foreground z-20 w-full cursor-default p-4 pt-0 text-right text-sm hover:text-blue-400"
                    >
                        Reset
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
}
