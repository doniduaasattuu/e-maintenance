<?php

namespace App\Exports;

use App\Models\FunctionalLocation;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FunctionalLocationExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = FunctionalLocation::query()->latest();

        $area = $this->filters['area'] ?? null;
        if ($area) {
            $query->where('code', 'LIKE', "%{$area}%")
                ->orWhere('description', 'LIKE', "%{$area}%");
        }

        return $query;
    }

    public function map($functionalLocation): array
    {
        return [
            $functionalLocation->id,
            $functionalLocation->code,
            $functionalLocation->description,
            $functionalLocation->created_at?->format('Y-d-m h:i:s') ?? '-',
            $functionalLocation->updated_at?->format('Y-d-m h:i:s') ?? '-',
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

    #[Override]
    public function title(): string
    {
        return 'functional_locations';
    }
}
