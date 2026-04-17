<?php

namespace App\Exports;

use App\Models\Repository;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RepositoryExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Repository::query()->with(['uploadedBy']);

        $extension = $this->filters['extension'] ?? null;
        if ($extension) {
            is_array($extension)
                ? $query->whereIn('extension', $extension)
                : $query->where('extension', $extension);
        }

        return $query->latest();
    }

    public function map($repository): array
    {
        return [
            $repository->id,
            $repository->title,
            $repository->url(),
            $repository?->extension ?? '-',
            $repository?->uploadedBy?->name ?? '-',

            $repository?->created_at ?? '-',
            $repository?->updated_at ?? '-',
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Title',
            'Url',
            'Extension',
            'Uploaded by',
            'Uploaded at',
            'Updated at',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();

                // Loop dari baris ke-2 (karena baris 1 adalah header)
                for ($row = 2; $row <= $highestRow; $row++) {
                    $cell = 'C' . $row; // Kolom C adalah tempat URL berada
                    $url = $sheet->getCell($cell)->getValue();

                    if ($url) {
                        // Mengaktifkan hyperlink pada sel tersebut
                        $sheet->getCell($cell)->getHyperlink()->setUrl($url);

                        // Memberikan gaya visual agar user tahu itu link (Biru & Underline)
                        $sheet->getStyle($cell)->applyFromArray([
                            'font' => [
                                'color' => ['rgb' => '0000FF'],
                                'underline' => 'single'
                            ]
                        ]);
                    }
                }
            },
        ];
        // return [
        //     AfterSheet::class => function (AfterSheet $event) {
        //         // Mendapatkan range sel dari header (A1 sampai kolom terakhir)
        //         // Contoh: Jika kolom Anda sampai N, maka 'A1:N1'
        //         $lastColumn = $event->sheet->getHighestColumn();
        //         $cellRange = 'B1:' . $lastColumn . '1';

        //         // Mengaktifkan fitur AutoFilter pada baris pertama (Header)
        //         $event->sheet->getDelegate()->setAutoFilter($cellRange);
        //     },
        // ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true]],
        ];
    }
}
