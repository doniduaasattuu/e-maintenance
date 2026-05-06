<?php

namespace App\Exports;

use App\Models\FindingPriority;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class FindingPriorityExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return FindingPriority::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'label',
            'description',
            'color_code',
            'sla_resolution_hours',
            'created_at',
            'updated_at',
        ];
    }

    public function map($findingPriority): array
    {
        return [
            $findingPriority->id,
            $findingPriority->label,
            $findingPriority->description,
            $findingPriority->color_code,
            $findingPriority->sla_resolution_hours,
            $findingPriority->created_at?->format('Y-d-m h:i:s'),
            $findingPriority->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'finding_priorities';
    }
}
