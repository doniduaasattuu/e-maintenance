<?php

namespace App\Services;

use App\Http\Requests\Repository\StoreRepositoryRequest;
use App\Http\Requests\Repository\UpdateRepositoryRequest;
use App\Models\Repository;
use Illuminate\Support\Facades\Storage;

class RepositoryService
{
    public function store(StoreRepositoryRequest $request)
    {
        $validated = $request->validated();

        $file = $request->file('file');
        $repoPath = $file->store('repositories', 'public');
        $extension = $file->extension();
        $mime_type = $file->getClientMimeType();

        Repository::create([
            'title'        => $validated['title'],
            'uploaded_by'  => $validated['uploaded_by'],
            'extension'    => $extension,
            'mime_type'    => $mime_type,
            'path'         => $repoPath,
        ]);
    }

    public function destroy(Repository $repository)
    {
        if (Storage::disk('public')->exists($repository->path)) {
            Storage::disk('public')->delete($repository->path);
        }

        $repository->delete();
    }

    public function update(UpdateRepositoryRequest $request, Repository $repository)
    {
        $validated = $request->validated();

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $extension = $file->extension();
            $mime_type = $file->getClientMimeType();

            $oldExtension = $repository->extension;

            if (Storage::disk('public')->exists($repository->path)) {
                Storage::disk('public')->delete($repository->path);
            }

            if ($oldExtension !== $extension) {
                $newPath = str_replace('.' . $oldExtension, '.' . $extension, $repository->path);
            } else {
                $newPath = $repository->path;
            }

            Storage::disk('public')->put($newPath, file_get_contents($file));

            $repository->update([
                'title'       => $validated['title'],
                'uploaded_by' => $validated['uploaded_by'],
                'extension'   => $extension,
                'mime_type'   => $mime_type,
                'path'        => $newPath,
            ]);
        } else {
            $repository->update([
                'title'        => $validated['title'],
            ]);
        }
    }
}
