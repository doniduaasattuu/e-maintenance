<?php

namespace App\Exports;

use App\Models\EquipmentStatus;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class EquipmentStatusExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return EquipmentStatus::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'code',
            'name',
            'description',
            'created_at',
            'updated_at',
        ];
    }

    public function map($EquipmentStatus): array
    {
        return [
            $EquipmentStatus->id,
            $EquipmentStatus->code,
            $EquipmentStatus->name,
            $EquipmentStatus->description,
            $EquipmentStatus->created_at?->format('Y-d-m h:i:s'),
            $EquipmentStatus->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'equipment_statuses';
    }
}
