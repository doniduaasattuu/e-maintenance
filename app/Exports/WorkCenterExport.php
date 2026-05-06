<?php

namespace App\Exports;

use App\Models\WorkCenter;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class WorkCenterExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return WorkCenter::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'code',
            'name',
            'created_at',
            'updated_at',
        ];
    }

    public function map($workCenter): array
    {
        return [
            $workCenter->id,
            $workCenter->code,
            $workCenter->name,
            $workCenter->created_at?->format('Y-d-m h:i:s'),
            $workCenter->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'work_centers';
    }
}
