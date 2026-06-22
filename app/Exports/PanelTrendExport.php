<?php

namespace App\Exports;

use App\Models\InspectionPanel;
use App\Models\Equipment;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PanelTrendExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    ShouldAutoSize,
    WithStyles
{
    protected Equipment $equipment;

    protected ?string $startDate;

    protected ?string $endDate;

    public function __construct(
        Equipment $equipment,
        ?string $startDate = null,
        ?string $endDate = null
    ) {
        $this->equipment = $equipment;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection(): Collection
    {
        return InspectionPanel::query()
            ->select([
                'inspection_panels.*',
                'equipment_inspection_forms.created_at as inspected_at',
            ])
            ->join(
                'equipment_inspection_forms',
                'equipment_inspection_forms.formable_id',
                '=',
                'inspection_panels.id'
            )
            ->where(
                'equipment_inspection_forms.formable_type',
                InspectionPanel::class
            )
            ->where(
                'equipment_inspection_forms.equipment_id',
                $this->equipment->id
            )
            ->when(
                $this->startDate,
                fn($q) => $q->whereDate(
                    'equipment_inspection_forms.created_at',
                    '>=',
                    $this->startDate
                )
            )
            ->when(
                $this->endDate,
                fn($q) => $q->whereDate(
                    'equipment_inspection_forms.created_at',
                    '<=',
                    $this->endDate
                )
            )
            ->orderBy('equipment_inspection_forms.created_at')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Inspection Date',

            'Operational',
            'Clean',

            'Temp Incoming R',
            'Temp Incoming S',
            'Temp Incoming T',

            'Temp Cabinet',

            'Temp Outgoing R',
            'Temp Outgoing S',
            'Temp Outgoing T',

            'Current R',
            'Current S',
            'Current T',
        ];
    }

    public function map($row): array
    {
        return [
            $row->inspected_at,

            $row->is_operational ? 'YES' : 'NO',
            $row->is_clean ? 'YES' : 'NO',

            $row->temperature_incoming_r,
            $row->temperature_incoming_s,
            $row->temperature_incoming_t,

            $row->temperature_cabinet,

            $row->temperature_outgoing_r,
            $row->temperature_outgoing_s,
            $row->temperature_outgoing_t,

            $row->current_r,
            $row->current_s,
            $row->current_t,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                ],
            ],
        ];
    }
}
