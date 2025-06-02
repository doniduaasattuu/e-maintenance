import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import { Meta, MetaLink } from '@/types';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    meta: Meta;
}

// function mergeQueryWithUrl(rawUrl: string | null): string {
//     if (!rawUrl) return '#';

//     const currentParams = new URLSearchParams(window.location.search);
//     const newUrl = new URL(rawUrl, window.location.origin);

//     currentParams.forEach((value, key) => {
//         if (!newUrl.searchParams.has(key)) {
//             newUrl.searchParams.set(key, value);
//         }
//     });

//     return newUrl.pathname + '?' + newUrl.searchParams.toString();
// }

export function GeneratePagination({ meta }: PaginationProps) {
    const isHavePagination = meta.links.length > 3;
    return isHavePagination ? (
        <Pagination>
            <PaginationContent className="flex-wrap">
                {meta.links.map((link: MetaLink, index: number) => {
                    const isPrevious = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');
                    const isEllipsis = link.label === '...';

                    return (
                        <PaginationItem key={index}>
                            {isEllipsis ? (
                                <PaginationEllipsis />
                            ) : isPrevious ? (
                                // <Link href={mergeQueryWithUrl(link.url)} as="button" preserveScroll>
                                <Link href={link.url ?? '#'} as="button" preserveScroll>
                                    <PaginationPrevious isActive={link.active} className={!link.url ? 'pointer-events-none opacity-50' : ''} />
                                </Link>
                            ) : isNext ? (
                                // <Link href={mergeQueryWithUrl(link.url)} as="button" preserveScroll>
                                <Link href={link.url ?? '#'} as="button" preserveScroll>
                                    <PaginationNext isActive={link.active} className={!link.url ? 'pointer-events-none opacity-50' : ''} />
                                </Link>
                            ) : (
                                // <Link href={mergeQueryWithUrl(link.url)} as="button" preserveScroll>
                                <Link href={link.url ?? '#'} as="button" preserveScroll>
                                    <PaginationLink isActive={link.active}>{link.label}</PaginationLink>
                                </Link>
                            )}
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    ) : null;
}
