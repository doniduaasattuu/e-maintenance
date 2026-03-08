<?php

namespace App\Http\Controllers;

use App\Models\Finding;
use App\Models\FindingImage;
use App\Models\FindingStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

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
        $request->validate([
            'images'                 => ['required', 'array', 'min:1', 'max:5'],
            'images.*'               => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
        ]);

        Gate::authorize('update_finding');

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
                'finding_status_id' => $statusReview->id,
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
