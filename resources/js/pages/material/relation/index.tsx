import HeadingSmall from '@/components/heading-small';
import RemovableBadge from '@/components/removable-badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import MaterialLayout from '@/layouts/material/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Equipment, Material } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const strings = UI_STRINGS;

interface MaterialRelationParams {
    material: {
        data: Material;
    };
    equipments: {
        data: Equipment[];
    };
}

export default function MaterialRelation({ material, equipments }: MaterialRelationParams) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.MATERIAL?.plural ?? 'Materials',
            href: route('materials.index'),
        },
        {
            title: material.data.code,
            href: route('materials.show', material.data.id),
        },
        {
            title: 'Relation',
            href: route('materials.create'),
        },
    ];
    const [input, setInput] = useState('');
    const selected = useRef<Equipment | null>(null);
    const [options, setOptions] = useState<Equipment[]>([]);

    const handleFetchRelation = useCallback(async (search: string) => {
        let axiosRoute: string = '';

        axiosRoute = route('equipments.index');

        try {
            const res = await axios.get(axiosRoute, { params: { query: search } });
            setOptions(res.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            setOptions([]);
        }
    }, []);

    useEffect(() => {
        if (input.length > 0) {
            const delayDebounce = setTimeout(() => {
                handleFetchRelation(input);
            }, 300);

            return () => clearTimeout(delayDebounce);
        } else {
            if (selected.current) {
                setOptions([selected.current]);
            } else {
                setOptions([]);
            }
        }
    }, [input, handleFetchRelation]);

    function handleAttachRelation(materialId: number, relationId: number) {
        router.post(
            route('materials.equipment.store', {
                material: materialId,
                equipment: relationId,
            }),
        );
    }

    function handleDetachRelation(materialId: number, relationId: number) {
        router.delete(
            route('materials.equipment.destroy', {
                material: materialId,
                equipment: relationId,
            }),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relation" />

            <MaterialLayout material={material.data} className="w-full max-w-xl space-y-6">
                <div className="flex items-center justify-between gap-2">
                    <HeadingSmall title="Relation" description="List of related equipment that using this material." />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size={'sm'} variant={'outline'}>
                                Add
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="p-0 lg:w-md" align="end">
                            <Command shouldFilter={false}>
                                <CommandInput placeholder="Search..." value={input} onValueChange={(e) => setInput(e.toUpperCase())} />
                                <CommandList>
                                    {Array.isArray(options) && options.length > 0 ? (
                                        <CommandGroup>
                                            {options.map((relation: Equipment) => (
                                                <CommandItem
                                                    key={relation.id}
                                                    onSelect={() => {
                                                        handleAttachRelation(material.data.id, relation.id);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            (() => {
                                                                return equipments.data.map((e) => e.id).includes(relation.id)
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0';
                                                            })(),
                                                        )}
                                                    />
                                                    <div className="flex gap-2">
                                                        {selected.current && selected.current?.id == relation.id && <Check />}
                                                        <div className="w-full">
                                                            <div className="font-medium">{relation.code}</div>
                                                            <div className="text-muted-foreground max-w-xs truncate text-sm sm:max-w-full">
                                                                {relation.sort_field}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    ) : (
                                        <CommandEmpty>No results found.</CommandEmpty>
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-wrap gap-2">
                    {equipments.data &&
                        equipments.data.length > 0 &&
                        equipments.data.map((equipment: Equipment) => (
                            <RemovableBadge
                                label={equipment.code}
                                onView={() => router.visit(route('equipments.show', equipment.id))}
                                onRemove={() => handleDetachRelation(material.data.id, equipment.id)}
                            />
                        ))}
                </div>
            </MaterialLayout>
        </AppLayout>
    );
}
