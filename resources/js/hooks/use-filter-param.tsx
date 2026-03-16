import { router } from '@inertiajs/react';
import * as React from 'react';

export function useFilterParam(paramKey: string) {
    const getInitialValues = (): string[] => {
        const searchParams = new URLSearchParams(window.location.search);
        const values: string[] = [];
        let index = 0;
        while (searchParams.has(`${paramKey}[${index}]`)) {
            values.push(searchParams.get(`${paramKey}[${index}]`)!);
            index++;
        }
        return values;
    };

    const [selectedValues, setSelectedValues] = React.useState<string[]>(getInitialValues);

    const handleFilter = (newValues: string[]) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) searchParams.set('page', '1');

        let index = 0;
        while (searchParams.has(`${paramKey}[${index}]`)) {
            searchParams.delete(`${paramKey}[${index}]`);
            index++;
        }

        newValues.forEach((val, i) => searchParams.set(`${paramKey}[${i}]`, val));

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClearAll = (e: string) => {
        const params = new URLSearchParams(window.location.search);

        const keysToDelete: string[] = [];

        params.forEach((value, key) => {
            if (key.startsWith(e)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach((key) => params.delete(key));

        if (params.has('page')) params.set('page', '1');

        setSelectedValues([]);

        router.get(window.location.pathname, Object.fromEntries(params.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const toggleValue = (value: string) => {
        const newValues = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];

        setSelectedValues(newValues);
        handleFilter(newValues);
    };

    return { selectedValues, toggleValue, handleClearAll };
}
