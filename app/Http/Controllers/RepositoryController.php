<?php

namespace App\Http\Controllers;

use App\Exports\RepositoryExport;
use App\Http\Requests\Repository\StoreRepositoryRequest;
use App\Http\Requests\Repository\UpdateRepositoryRequest;
use App\Http\Resources\RepositoryResource;
use App\Models\Repository;
use App\Services\RepositoryService;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class RepositoryController extends Controller
{
    use HasPerPagePreference;
    private $repositoryService;

    public function __construct(RepositoryService $repositoryService)
    {
        $this->repositoryService = $repositoryService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_repository');

        $perPage = $this->getPerPage($request);

        $repositories = Repository::with('uploadedBy')->orderBy('id', 'DESC')->search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('repository/index', [
            'repositories' => RepositoryResource::collection($repositories),
            'extensions' => Repository::distinct()->pluck('extension'),
            'renderable' => config('repository.renderable'),
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
        Gate::authorize('create_repository');

        return Inertia::render('repository/create', [
            'maximum_file_upload' => config('app.maximum_file_upload'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRepositoryRequest $request)
    {
        Gate::authorize('store_repository');

        try {
            $this->repositoryService->store($request);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed to store repository',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Repository $repository)
    {
        Gate::authorize('show_repository');

        if (Storage::disk('public')->exists($repository->path)) {

            $extension = pathinfo($repository->path, PATHINFO_EXTENSION);
            $downloadName = $repository->title . '.' . $extension;

            return Storage::disk('public')->download($repository->path, $downloadName);
        } else {
            return back()->with('message', [
                'type' => 'alert',
                'description' => 'Repository is not exists',
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Repository $repository)
    {
        Gate::authorize('edit_repository');

        return Inertia::render('repository/edit', [
            'repository' => new RepositoryResource($repository),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRepositoryRequest $request, Repository $repository)
    {
        Gate::authorize('update_repository');

        try {

            $this->repositoryService->update($request, $repository);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating repository',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Repository $repository)
    {
        Gate::authorize('delete_repository');

        try {
            $this->repositoryService->destroy($repository);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Repository deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Repository is not found',
            ]);
        }
    }

    public function export(Request $request)
    {
        $filters = [
            'extension' => $request->query('extension'),
        ];

        return Excel::download(new RepositoryExport($filters), 'Documents_' . now()->format('Ymd_His') . '.xlsx');
    }
}
