<?php

namespace App\Http\Controllers;

use App\Exports\FindingExport;
use App\Http\Requests\Finding\Abnormality\StoreAbnormalityRequest;
use App\Http\Requests\Finding\Abnormality\UpdateAbnormalityRequest;
use App\Http\Requests\Finding\BulkDeleteFindingsRequest;
use App\Models\Finding;
use App\Models\FindingType;
use Error;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class AbnormalityController extends FindingController
{
    protected function getTypeCode(): string
    {
        return 'ABN';
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return parent::index($request);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return parent::create();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAbnormalityRequest $request)
    {
        try {
            $this->performStore($request->validated());

            return redirect()->route('abnormalities.index')->with('message', [
                'type' => 'success',
                'description' => 'Abnormality and ' . count($request->file('images')) . ' photos saved successfully.',
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
        $finding = Finding::findOrFail($id);

        return parent::display($finding);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $finding = Finding::findOrFail($id);

        return parent::revise($finding);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAbnormalityRequest $request, Finding $finding)
    {
        try {
            $this->performUpdate($request, $finding);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Audit report updated successfully.',
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
        $finding = Finding::findOrFail($id);

        parent::finish($request, $finding);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $finding = Finding::findOrFail($id);

        try {
            $this->delete($request, $finding);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding deleted successfully.',
            ]);
        } catch (\Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage()
            ]);
        }
    }

    public function export(Request $request)
    {
        $filters = [
            'start_date'     => $request->query('start_date'),
            'end_date'       => $request->query('end_date'),
            'status_ids'     => $request->query('status_ids'),
            'department_ids' => $request->query('department_ids'),
            'priority_ids'   => $request->query('priority_ids'),
            'type_id'        => FindingType::where('code', $request->query('type_code'))->firstOrFail()->id,
        ];

        return Excel::download(new FindingExport($filters), 'Abnormalities_Reports_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function bulkDelete(BulkDeleteFindingsRequest $request)
    {
        Gate::authorize('bulkDelete');

        $validated = $request->validated();

        $ids = $validated['finding_ids'];
        $forceDelete = $validated['force_delete'] ?? false;

        try {
            DB::transaction(function () use ($ids, $forceDelete) {
                $findings = Finding::withTrashed()
                    ->whereIn('id', $ids)
                    ->get();

                // Ensure all submitted IDs exist.
                if ($findings->count() !== count($ids)) {
                    throw new Exception('Some findings could not be found.');
                }

                foreach ($findings as $finding) {
                    if ($forceDelete) {
                        // Only allow permanent deletion of trashed findings.
                        if (!$finding->trashed()) {
                            throw new Exception(
                                'Only deleted findings can be permanently deleted.'
                            );
                        }

                        Gate::authorize('forceDelete', $finding);

                        $directoryPath = 'images/findings/' . $finding->id;

                        $finding->images()->delete();

                        $finding->forceDelete();

                        // Delete physical files after successful database commit.
                        DB::afterCommit(function () use ($directoryPath) {
                            if (Storage::disk('public')->exists($directoryPath)) {
                                Storage::disk('public')->deleteDirectory($directoryPath);
                            }
                        });
                    } else {
                        // Only allow soft deletion of active findings.
                        if ($finding->trashed()) {
                            throw new Exception(
                                'Some findings have already been deleted.'
                            );
                        }

                        Gate::authorize('delete', $finding);

                        $finding->update([
                            'deleted_by' => auth()->id(),
                            'deleted_reason' => 'Bulk deletion',
                        ]);

                        $finding->delete();
                    }
                }
            });

            return back()->with('message', [
                'type' => 'success',
                'description' => $forceDelete
                    ? 'Findings permanently deleted successfully.'
                    : 'Findings deleted successfully.',
            ]);
        } catch (Throwable $e) {
            report($e);

            return back()->with('message', [
                'type' => 'error',
                'description' => $forceDelete
                    ? 'Failed to permanently delete findings.'
                    : 'Failed to delete findings.',
            ]);
        }
    }
}
