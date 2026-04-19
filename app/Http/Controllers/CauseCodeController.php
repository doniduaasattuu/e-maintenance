<?php

namespace App\Http\Controllers;

use App\Http\Requests\CauseCode\StoreCauseCodeRequest;
use App\Http\Requests\CauseCode\UpdateCauseCodeRequest;
use App\Http\Resources\CauseCodeResource;
use App\Models\CauseCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class CauseCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_causecode');

        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $causeCodes = CauseCode::search($request)
            ->orderBy('code', 'ASC')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('cause-code/index', [
            'causeCodes' => CauseCodeResource::collection($causeCodes),
            'filters' => $request->only(['query', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_causecode');

        return Inertia::render('cause-code/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCauseCodeRequest $request)
    {
        Gate::authorize('store_causecode');

        try {
            CauseCode::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating cause code',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CauseCode $causeCode)
    {
        Gate::authorize('show_causecode');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CauseCode $causeCode)
    {
        Gate::authorize('edit_causecode');

        return Inertia::render('cause-code/edit', [
            'causeCode' => new CauseCodeResource($causeCode),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCauseCodeRequest $request, CauseCode $causeCode)
    {
        Gate::authorize('update_causecode');

        try {
            $causeCode->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating cause code',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CauseCode $causeCode)
    {
        Gate::authorize('delete_causecode');

        try {
            $causeCode->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Cause code deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Cause code is not found',
            ]);
        }
    }
}
