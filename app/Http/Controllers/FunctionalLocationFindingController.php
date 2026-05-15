<?php

namespace App\Http\Controllers;

use App\Exports\FindingExport;
use App\Http\Resources\FunctionalLocationResource;
use App\Http\Resources\FindingResource;
use App\Models\FunctionalLocation;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class FunctionalLocationFindingController extends Controller
{
    use HasPerPagePreference;

    public function show(Request $request, FunctionalLocation $functionalLocation)
    {
        $perPage = $this->getPerPage($request);

        return Inertia::render('functional-location/findings', [
            'functionalLocation' => new FunctionalLocationResource($functionalLocation),
            'findings' => FindingResource::collection(
                $functionalLocation->findings()
                    ->withAllRelations()
                    ->latest()
                    ->search($request)
                    ->paginate($perPage)
                    ->withQueryString()
            ),
        ]);
    }

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
