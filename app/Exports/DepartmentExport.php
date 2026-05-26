<?php

namespace App\Exports;

use App\Models\Department;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Override;

class DepartmentExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle
{
    public function query()
    {
        return Department::query();
    }

    public function headings(): array
    {
        return [
            'id',
            'code',
            'name',
            'division_id',
            'created_at',
            'updated_at',
        ];
    }

    public function map($department): array
    {
        return [
            $department->id,
            $department->code,
            $department->name,
            $department->division_id,
            $department->created_at?->format('Y-d-m h:i:s'),
            $department->updated_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'departments';
    }
}
