import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import truncateText, { cn } from '@/lib/utils';
import { Equipment, Meta, Repository } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Params {
    equipment: {
        data: Equipment;
    };
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    open: boolean;
    setOpen: () => void;
}

// const handleSumbit = (equipmentId: number, repositoryId: number) => {
//     console.log(equipmentId, repositoryId);
// };

export default function EquipmentRepositoryDialog({ open, setOpen, equipment, repositories }: Params) {
    const [options, setOptions] = useState<Repository[]>([]);
    const [input, setInput] = useState('');
    const selected = useRef<Repository | null>(null);

    const handleFetchRelation = useCallback(async (search: string) => {
        try {
            const res = await axios.get(route('repositories.index'), { params: { query: search } });
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

    function handleAttachRepository(repositoryId: number, equipmentId: number) {
        router.post(
            route('repositories.equipment.store', {
                repository: repositoryId,
                equipment: equipmentId,
            }),
        );
    }

    function handleDetachRepository(repositoryId: number, equipmentId: number) {
        router.delete(
            route('repositories.equipment.destroy', {
                repository: repositoryId,
                equipment: equipmentId,
            }),
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogContent className="max-w-sm sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Document</DialogTitle>
                        <DialogDescription>Attach related documents to this equipment.</DialogDescription>
                    </DialogHeader>
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Search..." value={input} onValueChange={(e) => setInput(e)} />
                        <CommandList className="min-h-[50vh]">
                            {Array.isArray(options) && options.length > 0 ? (
                                <CommandGroup className="h-full">
                                    {options.map((repository: Repository) => (
                                        <CommandItem
                                            key={repository.id}
                                            onSelect={() => {
                                                if (!repositories.data.map((e) => e.id).includes(repository.id)) {
                                                    handleAttachRepository(repository.id, equipment.data.id);
                                                } else {
                                                    handleDetachRepository(repository.id, equipment.data.id);
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    repositories.data.some((e) => e.id === repository.id) ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                            <div className="flex gap-2">
                                                <div>
                                                    <div title={repository.title} className="w-full truncate font-medium">
                                                        {repository.id} - {truncateText(repository.title, 40)}
                                                    </div>
                                                    <div className="text-muted-foreground max-w-xs truncate text-sm sm:max-w-full">
                                                        {repository.extension} - {repository.mime_type}
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
                </DialogContent>
            </form>
        </Dialog>
    );
}
