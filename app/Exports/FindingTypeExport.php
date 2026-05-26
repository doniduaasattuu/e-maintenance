<?php

namespace App\Exports;

use App\Models\FindingType;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class FindingTypeExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return FindingType::query();
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

    public function map($findingType): array
    {
        return [
            $findingType->id,
            $findingType->code,
            $findingType->name,
            $findingType->description,
            $findingType->created_at?->format('Y-d-m h:i:s'),
            $findingType->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'finding_types';
    }
}
