<?php

namespace App\Exports;

use App\Models\EquipmentClass;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class EquipmentClassExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return EquipmentClass::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'code',
            'name',
            'formable_type',
            'description',
            'created_at',
            'updated_at',
        ];
    }

    public function map($equipmentClass): array
    {
        return [
            $equipmentClass->id,
            $equipmentClass->code,
            $equipmentClass->name,
            $equipmentClass->formable_type,
            $equipmentClass->description,
            $equipmentClass->created_at?->format('Y-d-m h:i:s') ?? '-',
            $equipmentClass->updated_at?->format('Y-d-m h:i:s') ?? '-',
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'equipment_classes';
    }
}
