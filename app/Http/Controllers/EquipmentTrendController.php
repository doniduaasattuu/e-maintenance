<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentTrendController extends Controller
{
    public function show(Request $request, Equipment $equipment)
    {
        $equipment->load('eclass');

        if ($equipment->eclass->formable_type === 'PANEL') {
            return app(InspectionPanelController::class)->show($request, $equipment);
        } else {
            return back()->with('message', [
                'type' => 'info',
                'description' => 'This equipment does not have a trend view available.',
            ]);
        }
    }
}
