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
use Carbon\Carbon;

class FindingMomExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithEvents
{
    public function query()
    {
        $oneWeekAgo = now()->subDays(7)->startOfDay();

        return Finding::query()
            ->withAllRelations()
            ->where(function ($query) use ($oneWeekAgo) {
                // 1. Tampilkan yang BELUM Closed TAPI dibuat dalam 7 hari terakhir
                $query->where(function ($q) use ($oneWeekAgo) {
                    $q->whereHas('status', fn($sq) => $sq->where('name', '!=', 'Closed'))
                        ->where('created_at', '>=', $oneWeekAgo);
                })
                    // 2. ATAU yang SUDAH Closed dalam 7 hari terakhir
                    ->orWhere(function ($q) use ($oneWeekAgo) {
                        $q->whereHas('status', fn($sq) => $sq->where('name', 'Closed'))
                            ->where('created_at', '>=', $oneWeekAgo);
                    });
            })
            ->latest('created_at');
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
            'Inspected By',
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
