import HeadingSmall from '@/components/heading-small';
import RemovableBadge from '@/components/removable-badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import RepositoryLayout from '@/layouts/repository/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Equipment, Material, Repository } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Check, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface RepositoryRelationProps {
    repository: {
        data: Repository;
    };
    equipments: {
        data: Equipment[];
    };
    materials: {
        data: Material[];
    };
}

export default function RepositoryRelation({ repository, equipments, materials }: RepositoryRelationProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.REPOSITORY?.plural ?? 'Repositories',
            href: route('repositories.index'),
        },
        {
            title: 'Relation',
            href: route('repositories.relation', repository.data.id),
        },
    ];

    const [activeTab, setActiveTab] = useState('equipment');
    const [open, setOpen] = useState(false);

    const [input, setInput] = useState('');
    const selected = useRef<Equipment | null>(null);
    const [options, setOptions] = useState<Equipment[]>([]);

    const handleFetchRelation = useCallback(
        async (search: string) => {
            let axiosRoute: string = '';

            switch (activeTab) {
                case 'equipment':
                    axiosRoute = route('equipments.index');
                    break;
                case 'material':
                    axiosRoute = route('materials.index');
                    break;
            }

            try {
                const res = await axios.get(axiosRoute, { params: { query: search } });
                setOptions(res.data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: unknown) {
                setOptions([]);
            }
        },
        [activeTab],
    );

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

    function handleAttachRelation(repositoryId: number, relationId: number) {
        switch (activeTab) {
            case 'equipment':
                if (equipments.data.map((e) => e.id).includes(relationId)) {
                    return null;
                } else {
                    router.post(
                        route('repositories.equipment.store', {
                            repository: repositoryId,
                            equipment: relationId,
                        }),
                    );
                }
                break;

            case 'material':
                if (materials.data.map((e) => e.id).includes(relationId)) {
                    return null;
                } else {
                    router.post(
                        route('repositories.material.store', {
                            repository: repositoryId,
                            material: relationId,
                        }),
                    );
                }
                break;
        }
    }

    function handleDetachRelation(repositoryId: number, relationId: number) {
        switch (activeTab) {
            case 'equipment':
                router.delete(
                    route('repositories.equipment.destroy', {
                        repository: repositoryId,
                        equipment: relationId,
                    }),
                );
                break;
            case 'material':
                router.delete(
                    route('repositories.material.destroy', {
                        repository: repositoryId,
                        material: relationId,
                    }),
                );
                break;
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relation" />

            <RepositoryLayout repository={repository.data} className="md:max-w-2xl">
                <div className="space-y-6">
                    <HeadingSmall title="Relation" description="List of related equipment and material." />
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <div className="flex items-center space-x-2">
                            <TabsList>
                                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                                <TabsTrigger value="material">Material</TabsTrigger>
                            </TabsList>

                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        <Plus />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0 lg:w-md" align="start">
                                    <Command shouldFilter={false}>
                                        <CommandInput placeholder="Search..." value={input} onValueChange={(e) => setInput(e.toUpperCase())} />
                                        <CommandList>
                                            {Array.isArray(options) && options.length > 0 ? (
                                                <CommandGroup>
                                                    {options.map((relation: Equipment | Material) => (
                                                        <CommandItem
                                                            key={relation.id}
                                                            onSelect={() => {
                                                                handleAttachRelation(repository.data.id, relation.id);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    (() => {
                                                                        if (activeTab === 'equipment') {
                                                                            return equipments.data.map((e) => e.id).includes(relation.id)
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0';
                                                                        }
                                                                        if (activeTab === 'material') {
                                                                            return materials.data.map((m) => m.id).includes(relation.id)
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0';
                                                                        }
                                                                        return 'opacity-0';
                                                                    })(),
                                                                )}
                                                            />
                                                            <div className="flex gap-2">
                                                                {selected.current && selected.current?.id == relation.id && <Check />}
                                                                <div className="w-full">
                                                                    <div className="font-medium">{relation.code}</div>
                                                                    <div className="text-muted-foreground max-w-xs truncate text-sm sm:max-w-full">
                                                                        {activeTab === 'equipment'
                                                                            ? (relation as Equipment).sort_field
                                                                            : activeTab === 'material'
                                                                              ? (relation as Material).name
                                                                              : null}
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
                        <TabsContent value="equipment" className="mt-4 gap-2 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {equipments.data &&
                                    equipments.data.length > 0 &&
                                    equipments.data.map((equipment: Equipment) => (
                                        <RemovableBadge
                                            label={equipment.code}
                                            onView={() => router.visit(route('equipments.show', equipment.id))}
                                            onRemove={() => handleDetachRelation(repository.data.id, equipment.id)}
                                        />
                                    ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="material" className="mt-4 gap-2 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {materials.data &&
                                    materials.data.length > 0 &&
                                    materials.data.map((material: Material) => (
                                        <RemovableBadge
                                            label={material.code}
                                            onView={() => {
                                                router.visit(route('materials.show', material.id));
                                            }}
                                            onRemove={() => handleDetachRelation(repository.data.id, material.id)}
                                        />
                                    ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </RepositoryLayout>
        </AppLayout>
    );
}
