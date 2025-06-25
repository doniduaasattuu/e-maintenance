<?php

namespace App\Listeners;

use App\Events\EquipmentStatusChanged;
use App\Models\InstallDismantleHistory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogInstallDismantleHistory
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(EquipmentStatusChanged $event): void
    {
        InstallDismantleHistory::create([
            'equipment_id' => $event->equipment->id,
            'from_status_id' => $event->equipment->getOriginal('equipment_status_id'),
            'to_status_id' => $event->equipment->equipment_status_id,
            'from_sort_field' => $event->equipment->getOriginal('sort_field'),
            'to_sort_field' => $event->equipment->sort_field,
            'from_functional_location_id' => $event->equipment->getOriginal('functional_location_id'),
            'to_functional_location_id' => $event->equipment->functional_location_id,
            'changed_by' => $event->changedBy,
            'changed_at' => now(),
        ]);
    }
}
