<?php

namespace App\Exports;

use App\Models\Division;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class DivisionExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return Division::query();
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

    public function map($division): array
    {
        return [
            $division->id,
            $division->code,
            $division->name,
            $division->created_at?->format('Y-d-m h:i:s'),
            $division->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'divisions';
    }
}
