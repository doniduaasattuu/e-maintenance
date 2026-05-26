<?php

namespace App\Exports;

use App\Models\Material;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MaterialExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Material::query()->withDefaultRelations();

        $funclocId = $this->filters['functional_location_id'] ?? null;
        if ($funclocId) {
            $query->when($funclocId, function ($query) use ($funclocId) {
                $query->whereHas('equipments', function ($q) use ($funclocId) {
                    $q->where('functional_location_id', $funclocId);
                });
            });
        }

        $type = $this->filters['type_ids'] ?? null;
        if ($type) {
            is_array($type)
                ? $query->whereIn('material_type_id', $type)
                : $query->where('material_type_id', $type);
        }

        return $query->latest();
    }

    public function map($material): array
    {
        return [
            $material->id,
            $material->code,
            $material->name,
            $material?->price ?? '-',

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
