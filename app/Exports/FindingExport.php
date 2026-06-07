<?php

namespace App\Exports;

use App\Models\Finding;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FindingExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithEvents
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Finding::query()->withAllRelations();

        $type = $this->filters['type_id'] ?? null;
        if ($type) {
            $query->where('finding_type_id', $this->filters['type_id']);
        }

        $funclocIds = $this->filters['functional_location_id'] ?? null;
        if ($funclocIds) {
            is_array($funclocIds)
                ? $query->whereIn('functional_location_id', $funclocIds)
                : $query->where('functional_location_id', $funclocIds);
        }

        $funclocIds = $this->filters['equipment_id'] ?? null;
        if ($funclocIds) {
            is_array($funclocIds)
                ? $query->whereIn('equipment_id', $funclocIds)
                : $query->where('equipment_id', $funclocIds);
        }
        $status = $this->filters['status_ids'] ?? null;
        if ($status) {
            is_array($status)
                ? $query->whereIn('finding_status_id', $status)
                : $query->where('finding_status_id', $status);
        }

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
            $finding->created_at->format('d-M-y'),
            $finding->type->name ?? '-',
            $finding->status->name ?? '-',
            $finding->clause->code ?? '-',
            $finding->clause->description ?? '-',
            $finding->causeCode->code ?? '-',
            $finding->causeCode->description ?? '-',
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
            $finding->created_at ? Carbon::parse($finding->created_at)->format('d-M-y') : '-',
            $finding->closed_at ? Carbon::parse($finding->closed_at)->format('d-M-y') : '-',
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Date',
            'Type',
            'Status',
            'Clause Code',
            'Clause Description',
            'Cause Code',
            'Cause Description',
            'Priority',
            'Equipment',
            'Equipment Description',
            'Funcloc',
            'Funcloc Description',
            'Finding Description',
            'Department',
            'Rectification Plan',
            'Inspected By',
            'Action By',
            'Verified By',
            'Created Date',
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
