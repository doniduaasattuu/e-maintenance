/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { router, usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
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

    // Jalankan filter saat tanggal selesai dipilih (dari dan sampai)
    useEffect(() => {
        if (date?.from && date?.to) {
            // 1. Ambil query string saat ini dari URL
            const searchParams = new URLSearchParams(window.location.search);

            // 2. Set parameter tanggal
            searchParams.set('start_date', format(date.from, 'yyyy-MM-dd'));
            searchParams.set('end_date', format(date.to, 'yyyy-MM-dd'));

            // 3. Reset halaman ke 1 agar hasil filter tetap akurat
            // searchParams.set('page', '1');

            // 4. Lakukan request dengan mengirimkan seluruh searchParams yang sudah digabungkan
            router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
                preserveState: true,
                replace: true,
                preserveScroll: true, // Menjaga posisi scroll user
            });
        }
    }, [date?.from, date?.to]);

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
                        onSelect={setDate}
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
