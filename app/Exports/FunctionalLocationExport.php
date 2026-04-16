<?php

namespace App\Exports;

use App\Models\FunctionalLocation;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FunctionalLocationExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function query()
    {
        return FunctionalLocation::query()->latest();
    }

    public function map($functionalLocation): array
    {
        return [
            $functionalLocation->id,
            $functionalLocation->code,
            $functionalLocation->description,
            $functionalLocation?->created_at ?? '-',
            $functionalLocation?->updated_at ?? '-',
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Code',
            'Description',
            'Created at',
            'Updated at',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true]],
        ];
    }
}
