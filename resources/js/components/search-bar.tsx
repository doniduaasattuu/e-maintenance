import { router } from '@inertiajs/react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from './ui/input';

export default function SearchBar() {
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
            replace: true,
        });
    }, 300);

    return (
        <Input
            className="max-w-[250px]"
            defaultValue={new URLSearchParams(window.location.search).get('query') || ''}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
        />
    );
}
