<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ScannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('qr/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, string $equipment_code)
    {
        Gate::authorize('show_equipment');

        $equipment = Equipment::where('code', $equipment_code)->first();

        if ($equipment) {
            return redirect(route('equipments.show', $equipment->id));
        } else {
            return back()->with('message', [
                'type' => 'info',
                'description' => 'Equipment not found',
            ]);
        }
    }
}
