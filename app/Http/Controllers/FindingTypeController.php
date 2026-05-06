<?php

namespace App\Http\Controllers;

use App\Exports\FindingTypeExport;
use App\Http\Requests\FindingType\StoreFindingTypeRequest;
use App\Http\Requests\FindingType\UpdateFindingTypeRequest;
use App\Http\Resources\FindingTypeResource;
use App\Models\FindingType;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class FindingTypeController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_findingtype');

        $perPage = $this->getPerPage($request);

        $findingTypes = FindingType::search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('finding-type/index', [
            'findingTypes' => FindingTypeResource::collection($findingTypes),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_findingtype');

        return Inertia::render('finding-type/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFindingTypeRequest $request)
    {
        Gate::authorize('store_findingtype');

        try {
            FindingType::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating finding type',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FindingType $findingType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FindingType $findingType)
    {
        Gate::authorize('edit_findingtype');

        return Inertia::render('finding-type/edit', [
            'findingType' => new FindingTypeResource($findingType),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFindingTypeRequest $request, FindingType $findingType)
    {
        Gate::authorize('update_findingtype');

        try {
            $findingType->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating finding type',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FindingType $findingType)
    {
        Gate::authorize('delete_findingtype');

        try {
            $findingType->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding type deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Finding type is not found',
            ]);
        }
    }

    public function export(Request $request)
    {
        return Excel::download(new FindingTypeExport(), 'Finding_Types_' . now()->format('Ymd_His') . '.xlsx');
    }
}
