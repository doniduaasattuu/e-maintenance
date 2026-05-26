<?php

namespace App\Exports;

use App\Models\Equipment;
use App\Models\Material;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EquipmentMaterialExport implements FromCollection, WithTitle, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected Equipment $equipment;

    public function __construct(Equipment $equipment)
    {
        $this->equipment = $equipment;
    }

    public function collection()
    {
        return $this->equipment->materials;
    }

    public function title(): string
    {
        return 'BOM ' . $this->equipment->code;
    }

    public function map($material): array
    {
        return [
            $material->id,
            $material->code,
            $material->name,
            $material?->price ?? '-',

            $material->pivot?->quantity ?? '1',
            $material->pivot?->note ?? '-',

            $material?->type?->code ?? '-',
            $material?->type?->description ?? '-',
            $material?->unit?->name ?? '-',

            $material?->created_at ?? '-',
            $material?->updated_at ?? '-',
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Code',
            'Name',
            'Price',
            'Qty',
            'Note',
            'Type',
            'Type Description',
            'Unit',
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
