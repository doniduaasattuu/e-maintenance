<?php

namespace App\Exports;

use App\Models\Equipment;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EquipmentExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Equipment::query()->withDefaultRelations();

        $status = $this->filters['status_ids'] ?? null;
        if ($status) {
            is_array($status)
                ? $query->whereIn('equipment_status_id', $status)
                : $query->where('equipment_status_id', $status);
        }

        $class = $this->filters['class_ids'] ?? null;
        if ($class) {
            is_array($class)
                ? $query->whereIn('equipment_class_id', $class)
                : $query->where('equipment_class_id', $class);
        }

        return $query->latest();
    }

    public function map($equipment): array
    {
        return [
            $equipment->id,
            $equipment->code,
            $equipment?->sort_field ?? '-',
            $equipment?->description ?? '-',

            $equipment?->eclass?->name ?? '-',
            $equipment?->status?->name ?? '-',

            $equipment?->functionalLocation?->code ?? 'N/A',
            $equipment?->functionalLocation?->description ?? 'N/A',

            $equipment?->created_at ?? '-',
            $equipment?->updated_at ?? '-',
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Code',
            'Sort field',
            'Description',
            'Class',
            'Status',
            'Funcloc',
            'Funcloc Description',
            'Created at',
            'Updated at',
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
