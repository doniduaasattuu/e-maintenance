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

    public function map($EquipmentClass): array
    {
        return [
            $EquipmentClass->id,
            $EquipmentClass->code,
            $EquipmentClass->name,
            $EquipmentClass->formable_type,
            $EquipmentClass->description,
            $EquipmentClass->created_at?->format('Y-d-m h:i:s'),
            $EquipmentClass->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'equipment_classes';
    }
}
