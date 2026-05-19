<?php

namespace App\Http\Controllers;

use App\Http\Resources\FindingResource;
use App\Models\Finding;
use App\Models\FindingImage;
use App\Models\FindingStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;
use Illuminate\Validation\ValidationException;

class FindingImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Finding $finding)
    {
        Gate::authorize('resolve_finding');

        $validated = $request->validate([
            'rectification_action'   => ['required', 'string', 'min:10'],
            'images'                 => ['required', 'array', 'min:1', 'max:5'],
            'closed_at'            => [
                'required',
                'date_format:Y-m-d H:i:s',
                function ($attribute, $value, $fail) use ($finding) {
                    if (\Carbon\Carbon::parse($value)->lt($finding->created_at)) {
                        $fail("The completion time must not be earlier than the time the finding was made (" . $finding->created_at->format('d/m/Y H:i') . ").");
                    }
                },
            ],
            'images.*'               => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
        ]);

        if ($finding->images()->where('category', 'after')->count() > 5) {
            return back()->with('message', [
                'type' => 'error',
                'description' => 'Number of photos exceeds the maximum limit (5).',
            ]);
        }

        $statusReview = FindingStatus::where('name', 'Review')->firstOrFail();

        DB::beginTransaction();

        try {
            $finding->update([
                'rectification_action' => $validated['rectification_action'],
                'finding_status_id' => $statusReview->id,
                'rectified_by' => auth()->id(),
                'closed_at' => $validated['closed_at'],
            ]);

            foreach ($request->file('images') as $image) {
                $path = $image->store('images/findings/' . $finding->id, 'public');
                $uploadedPaths[] = $path;

                $finding->images()->create([
                    'file_path'     => $path,
                    'category'      => 'after',
                    'original_name' => $image->getClientOriginalName(),
                ]);
            }

            DB::commit();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Photos uploaded successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->with('message', [
                'type' => 'error',
                'description' => 'Failed uploading photos: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Finding $finding)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Finding $finding)
    {
        Gate::authorize('update', $finding);

        $finding->load(['images', 'type']);

        return Inertia::render('finding/image/edit', [
            'finding' => new FindingResource($finding),
            'type' => $finding->type->code,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Finding $finding)
    {
        // Gate::authorize('update', $finding);

        $validated = $request->validate([
            'images'                    => ['required', 'array', 'min:1', 'max:5'],
            'images.*'                  =>
            [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
            'category'                  => ['required', 'string', 'in:before,after'],
        ]);

        $currentCount = $finding->images()->where('category', $validated['category'])->count();
        $newCount = count($validated['images']);

        if ($currentCount + $newCount > 5) {
            // Throwing this native validation error automatically maps to errors.images on the frontend!
            throw ValidationException::withMessages([
                'images' => 'The total number of photos for this category cannot exceed 5. (Currently has ' . $currentCount . ')',
            ]);
        }

        try {
            DB::transaction(function () use ($validated, $finding) {
                $validated['inspected_by'] = auth()->id();

                if (request()->hasFile('images')) {
                    foreach (request()->file('images') as $image) {
                        $path = $image->store('images/findings/' . $finding->id, 'public');
                        FindingImage::create([
                            'finding_id'    => $finding->id,
                            'file_path'     => $path,
                            'category'      => $validated['category'],
                            'original_name' => $image->getClientOriginalName(),
                            'closed_at'     => null,
                        ]);
                    }
                }
            });

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Photos uploaded successfully.',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => 'Failed uploading photos: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Finding $finding, FindingImage $image)
    {
        Gate::authorize('delete', $finding);

        try {
            DB::transaction(function () use ($image) {
                if (Storage::disk('public')->exists($image->file_path)) {
                    Storage::disk('public')->delete($image->file_path);
                }

                $image->delete();
            });

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Photo deleted successfully.',
            ]);
        } catch (Throwable $e) {

            return back()->with('message', [
                'type' => 'error',
                'description' => 'Failed deleting photos: ' . $e->getMessage(),
            ]);
        }
    }
}
