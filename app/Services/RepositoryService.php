<?php

namespace App\Services;

use App\Http\Requests\Repository\StoreRepositoryRequest;
use App\Http\Requests\Repository\UpdateRepositoryRequest;
use App\Models\Repository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RepositoryService
{
    private function generateFilename(string $title, string $extension): string
    {
        return Str::slug($title) . '.' . Str::lower($extension);
    }

    public function store(StoreRepositoryRequest $request)
    {
        $validated = $request->validated();
        $file = $request->file('file');
        $extension = Str::lower($file->extension());
        $filename = $this->generateFilename(
            $validated['title'],
            $extension
        );
        $path = $file->storeAs(
            'repositories',
            $filename,
            'public'
        );

        Repository::create([
            'title'       => $validated['title'],
            'uploaded_by' => $validated['uploaded_by'],
            'extension'   => $extension,
            'mime_type'   => $file->getClientMimeType(),
            'path'        => $path,
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

        $title = $validated['title'];

        if ($request->hasFile('file')) {

            if (Storage::disk('public')->exists($repository->path)) {
                Storage::disk('public')->delete($repository->path);
            }

            $file = $request->file('file');

            $extension = Str::lower($file->extension());

            $filename = $this->generateFilename(
                $title,
                $extension
            );

            $path = $file->storeAs(
                'repositories',
                $filename,
                'public'
            );

            $repository->update([
                'title'       => $title,
                'uploaded_by' => $validated['uploaded_by'],
                'extension'   => $extension,
                'mime_type'   => $file->getClientMimeType(),
                'path'        => $path,
            ]);

            return;
        }

        // Tidak upload file, hanya rename file
        $extension = $repository->extension;

        $newFilename = $this->generateFilename(
            $title,
            $extension
        );

        $newPath = 'repositories/' . $newFilename;

        if (
            $repository->path !== $newPath &&
            Storage::disk('public')->exists($repository->path)
        ) {
            Storage::disk('public')->move(
                $repository->path,
                $newPath
            );
        }

        $repository->update([
            'title' => $title,
            'path'  => $newPath,
        ]);
    }
}
