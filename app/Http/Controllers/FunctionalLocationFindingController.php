<?php

namespace App\Http\Controllers;

use App\Exports\FindingExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class FunctionalLocationFindingController extends Controller
{
    public function export(Request $request)
    {
        $filters = [
            'functional_location_id'   => $request->query('functional_location_id'),
            'start_date'     => $request->query('start_date'),
            'end_date'       => $request->query('end_date'),
        ];

        return Excel::download(new FindingExport($filters), 'Functional_Location_Findings_' . now()->format('Ymd_His') . '.xlsx');
    }
}
