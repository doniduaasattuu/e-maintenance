<?php

namespace App\Exports;

use App\Models\FindingClause;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class FindingClauseExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return FindingClause::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'code',
            'type',
            'title',
            'description',
            'created_at',
            'updated_at',
        ];
    }

    public function map($findingClause): array
    {
        return [
            $findingClause->id,
            $findingClause->code,
            $findingClause->type,
            $findingClause->title,
            $findingClause->description,
            $findingClause->created_at?->format('Y-d-m h:i:s'),
            $findingClause->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'finding_clauses';
    }
}
