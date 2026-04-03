<?php

namespace App\Http\Controllers;

use App\Http\Requests\Finding\Audit\StoreAuditRequest;
use App\Http\Requests\Finding\Audit\UpdateAuditRequest;
use App\Models\Finding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AuditController extends FindingController
{
    protected function getTypeCode(): string
    {
        return 'AUD';
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_audit');

        return parent::index($request);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_audit');

        return parent::create();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAuditRequest $request)
    {
        Gate::authorize('store_audit');

        try {
            $this->performStore($request->validated());

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Audit and ' . count($request->file('images')) . ' photos saved successfully.',
            ]);
        } catch (\Throwable $e) {

            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        Gate::authorize('show_audit');

        $finding = Finding::findOrFail($id);

        return parent::display($finding);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        Gate::authorize('edit_audit');

        $finding = Finding::findOrFail($id);

        return parent::revise($finding);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAuditRequest $request, Finding $finding)
    {
        Gate::authorize('update_audit');

        try {
            $this->performUpdate($request, $finding);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Abnormality report updated successfully.',
            ]);
        } catch (\Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Mark finding as closed.
     */
    public function close(Request $request, string $id)
    {
        Gate::authorize('close_finding');

        $finding = Finding::findOrFail($id);

        parent::finish($request, $finding);
    }

    // public function close(Request $request, string $id)
    // {
    //     $finding = Finding::findOrFail($id);

    //     parent::close($request, $finding);
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Gate::authorize('delete_audit');

        $finding = Finding::findOrFail($id);

        try {
            $this->delete($finding);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Audit and photos deleted successfully.',
            ]);
        } catch (\Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage()
            ]);
        }
    }
}
