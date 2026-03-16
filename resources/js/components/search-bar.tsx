import { router } from '@inertiajs/react';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from './ui/input';

export default function SearchBar({ tabIndex }: { tabIndex?: number }) {
    const handleSearch = useDebouncedCallback((term: string) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (term) {
            searchParams.set('query', term);
        } else {
            searchParams.delete('query');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, 300);

    const searchBarRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                searchBarRef.current?.focus();
            }
        };

        document.addEventListener('keydown', down);
        return () => {
            document.removeEventListener('keydown', down);
        };
    }, []);

    return (
        <div className="relative md:w-64">
            <Input
                tabIndex={tabIndex}
                className="w-full"
                defaultValue={new URLSearchParams(window.location.search).get('query') || ''}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                ref={searchBarRef}
                type="small"
            />
            <p className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 p-0 text-xs" onClick={() => searchBarRef.current?.focus()}>
                <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span> K
                </kbd>
            </p>
        </div>
    );
}
