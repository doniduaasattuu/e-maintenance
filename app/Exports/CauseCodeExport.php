<?php

namespace App\Exports;

use App\Models\CauseCode;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class CauseCodeExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return CauseCode::query();
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

    public function map($CauseCode): array
    {
        return [
            $CauseCode->id,
            $CauseCode->code,
            $CauseCode->description,
            $CauseCode->created_at?->format('Y-d-m h:i:s'),
            $CauseCode->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'cause_codes';
    }
}
