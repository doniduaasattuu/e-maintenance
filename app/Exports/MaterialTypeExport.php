<?php

namespace App\Exports;

use App\Models\MaterialType;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class MaterialTypeExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return MaterialType::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'code',
            'description',
            'created_at',
            'updated_at',
        ];
    }

    public function map($materialType): array
    {
        return [
            $materialType->id,
            $materialType->code,
            $materialType->description,
            $materialType->created_at?->format('Y-d-m h:i:s'),
            $materialType->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'material_types';
    }
}
