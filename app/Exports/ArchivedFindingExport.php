<?php

namespace App\Exports;

use App\Models\Finding;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ArchivedFindingExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithEvents
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Finding::query()->withAllRelations();

        $query->whereHas('status', fn($q) => $q->where('name', 'Closed'));

        $dept = $this->filters['department_ids'] ?? null;
        if ($dept) {
            is_array($dept)
                ? $query->whereIn('department_id', $dept)
                : $query->where('department_id', $dept);
        }

        $priority = $this->filters['priority_ids'] ?? null;
        if ($priority) {
            is_array($priority)
                ? $query->whereIn('finding_priority_id', $priority)
                : $query->where('finding_priority_id', $priority);
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

    public function map($finding): array
    {
        return [
            $finding->id,
            $finding->created_at->format('d-m-Y'),
            $finding->type->name ?? '-',
            $finding->status->name ?? '-',
            $finding->priority->label ?? '-',
            $finding->equipment->code ?? 'N/A',
            $finding->equipment->description ?? 'N/A',
            $finding->functionalLocation->code ?? '-',
            $finding->functionalLocation->description ?? '-',
            $finding->description,
            $finding->department->name ?? '-',
            $finding->rectification_action ?? '-',
            $finding->inspector->name ?? '-',
            $finding->rectifier->name ?? '-',
            $finding->verifier->name ?? '-',
            $finding->closed_at ?? '-',
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Date',
            'Type',
            'Status',
            'Priority',
            'Equipment',
            'Equipment Description',
            'Funcloc',
            'Funcloc Description',
            'Finding Description',
            'Department',
            'Rectification Plan',
            'Inspector',
            'Action By',
            'Verified By',
            'Approved Date',
        ];
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
