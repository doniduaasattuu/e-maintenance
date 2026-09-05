<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImprovementCategory\StoreImprovementCategoryRequest;
use App\Http\Requests\ImprovementCategory\UpdateImprovementCategoryRequest;
use App\Http\Resources\ImprovementCategoryResource;
use App\Models\ImprovementCategory;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class ImprovementCategoryController extends Controller
{
    use HasPerPagePreference;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_improvementcategory');

        $perPage = $this->getPerPage($request);

        $improvementCategories = ImprovementCategory::search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('improvement-category/index', [
            'improvementCategories' => ImprovementCategoryResource::collection($improvementCategories),
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
        Gate::authorize('create_improvementcategory');

        return Inertia::render('improvement-category/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImprovementCategoryRequest $request)
    {
        Gate::authorize('store_improvementcategory');

        try {
            ImprovementCategory::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating improvement category',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ImprovementCategory $improvementCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ImprovementCategory $improvementCategory)
    {
        Gate::authorize('edit_improvementcategory');

        return Inertia::render('improvement-category/edit', [
            'improvementCategory' => new ImprovementCategoryResource($improvementCategory),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImprovementCategoryRequest $request, ImprovementCategory $improvementCategory)
    {
        Gate::authorize('update_improvementcategory');

        try {
            $improvementCategory->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating improvement category',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ImprovementCategory $improvementCategory)
    {
        Gate::authorize('delete_improvementcategory');

        try {
            $improvementCategory->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement category deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Improvement category is not found',
            ]);
        }
    }
}
