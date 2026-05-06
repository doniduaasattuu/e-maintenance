<?php

namespace App\Exports;

use App\Models\InstallDismantleHistory;
use Illuminate\Contracts\Database\Query\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use Override;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InstallDismantleHistoryExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize, WithTitle, WithStyles, WithEvents
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = InstallDismantleHistory::withAllRelations();

        $funclocId = $this->filters['functional_location_id'] ?? null;
        if ($funclocId) {
            $query->where(function ($q) use ($funclocId) {
                $q->whereRelation('fromFunctionalLocation', 'id', $funclocId)
                    ->orWhereRelation('toFunctionalLocation', 'id', $funclocId);
            });
        }

        $equipmentId = $this->filters['equipment_id'] ?? null;
        if ($equipmentId) {
            $query->where('equipment_id', $equipmentId);
        }

        $startDate = $this->filters['start_date'];
        $endDate = $this->filters['end_date'];
        $query->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        });

        return $query->latest();
    }

    public function headings(): array
    {
        return [
            'Id',
            'Equipment',
            'Status before',
            'Functional location before',
            'Status after',
            'Functional location after',
            'Changed by',
            'Date',
        ];
    }

    public function map($history): array
    {
        return [
            $history->id,
            $history->equipment?->code,
            $history->fromStatus?->code,
            $history->fromFunctionalLocation?->code,
            $history->toStatus?->code,
            $history->toFunctionalLocation?->code,
            $history->changedBy?->name,
            $history->changed_at?->format('Y-d-m h:i:s'),
        ];
    }

    #[Override]
    public function title(): string
    {
        return 'equipment_histories';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Mendapatkan range sel dari header (A1 sampai kolom terakhir)
                // Contoh: Jika kolom Anda sampai N, maka 'A1:N1'
                $lastColumn = $event->sheet->getHighestColumn();
                $cellRange = 'B1:' . $lastColumn . '1';

                // Mengaktifkan fitur AutoFilter pada baris pertama (Header)
                $event->sheet->getDelegate()->setAutoFilter($cellRange);
            },
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true]],
        ];
    }
}
