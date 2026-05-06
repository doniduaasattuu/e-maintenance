<?php

namespace App\Exports;

use App\Models\MaterialUnit;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class MaterialUnitExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return MaterialUnit::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'name',
            'created_at',
            'updated_at',
        ];
    }

    public function map($materialUnit): array
    {
        return [
            $materialUnit->id,
            $materialUnit->name,
            $materialUnit->created_at?->format('Y-d-m h:i:s'),
            $materialUnit->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'material_units';
    }
}
