<?php

namespace App\Exports;

use App\Models\FindingStatus;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class FindingStatusExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return FindingStatus::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'name',
            'description',
            'created_at',
            'updated_at',
        ];
    }

    public function map($findingStatus): array
    {
        return [
            $findingStatus->id,
            $findingStatus->name,
            $findingStatus->description,
            $findingStatus->created_at?->format('Y-d-m h:i:s'),
            $findingStatus->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'finding_statuses';
    }
}
