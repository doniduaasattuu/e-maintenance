/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from '@inertiajs/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface Material {
    id: number;
    part_number: string;
    description: string;
    pivot: {
        id: number;
        quantity: number;
        note: string;
    };
}

export default function EquipmentMaterialManager({ equipment, materials }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        material_id: '',
        quantity: 1,
        note: '',
    });

    const handleAddMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('equipments.materials.store', equipment.id), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
            },
        });
    };

    const handleUpdateQuantity = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMaterial) return;

        put(route('equipments.materials.update', [equipment.id, editingMaterial.id]), {
            onSuccess: () => {
                setEditingMaterial(null);
            },
        });
    };

    const handleDelete = (materialId: number) => {
        if (confirm('Are you sure you want to remove this material?')) {
            destroy(route('equipments.materials.destroy', [equipment.id, materialId]));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Standard Spare Parts</h3>
                    <p className="text-muted-foreground text-sm">List of materials commonly used for this equipment.</p>
                </div>

                {/* Dialog Tambah Material */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Material
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAddMaterial}>
                            <DialogHeader>
                                <DialogTitle>Add Material to Equipment</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Material</label>
                                    <select
                                        className="w-full rounded-md border p-2 text-sm"
                                        onChange={(e) => setData('material_id', e.target.value)}
                                        value={data.material_id}
                                    >
                                        <option value="">-- Select --</option>
                                        {materials.data.map((m: any) => (
                                            <option key={m.id} value={m.id}>
                                                {m.part_number} - {m.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quantity</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Note</label>
                                        <Input value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="Posisi/Ref" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tabel Material */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Part Number</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {materials.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                                    No materials linked yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {materials.data.map((material: Material) => (
                            <TableRow key={material.pivot.id}>
                                <TableCell className="font-medium">{material.part_number}</TableCell>
                                <TableCell>{material.description}</TableCell>
                                <TableCell className="text-center">{material.pivot.quantity}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{material.pivot.note}</TableCell>
                                <TableCell className="space-x-2 text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditingMaterial(material);
                                            setData({
                                                material_id: material.id.toString(),
                                                quantity: material.pivot.quantity,
                                                note: material.pivot.note || '',
                                            });
                                        }}
                                    >
                                        <Edit2 className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(material.id)}>
                                        <Trash2 className="text-destructive h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog Edit Quantity */}
            <Dialog open={!!editingMaterial} onOpenChange={() => setEditingMaterial(null)}>
                <DialogContent>
                    <form onSubmit={handleUpdateQuantity}>
                        <DialogHeader>
                            <DialogTitle>Update Material Quantity</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <p className="text-sm font-semibold">{editingMaterial?.description}</p>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quantity</label>
                                <Input
                                    type="number"
                                    step="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
