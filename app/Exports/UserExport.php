<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = User::query()->withDefaultRelations();

        $department = $this->filters['department_ids'] ?? null;
        if ($department) {
            $query->where(function ($q) use ($department) {
                is_array($department)
                    ? $q->whereIn('department_id', $department)
                    : $q->where('department_id', $department);

                $q->orWhereNull('department_id');
            });
        }

        $position = $this->filters['position_ids'] ?? null;
        if ($position) {
            $query->where(function ($q) use ($position) {
                is_array($position)
                    ? $q->whereIn('position_id', $position)
                    : $q->where('position_id', $position);

                $q->orWhereNull('position_id');
            });
        }

        $workCenter = $this->filters['work_center_ids'] ?? null;
        if ($workCenter) {
            $query->where(function ($q) use ($workCenter) {
                is_array($workCenter)
                    ? $q->whereIn('work_center_id', $workCenter)
                    : $q->where('work_center_id', $workCenter);

                $q->orWhereNull('work_center_id');
            });
        }

        return $query->latest();
    }

    public function map($user): array
    {
        return [
            $user->id,
            $user->employee_id,
            $user->name,
            $user->email,
            $user?->phone_number ?? '-',

            $user?->department?->name ?? '-',
            $user?->position?->name ?? '-',
            $user?->workCenter?->name ?? '-',

        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Employee ID',
            'Name',
            'Email',
            'Phone Number',
            'Department',
            'Position',
            'Work Center',
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
