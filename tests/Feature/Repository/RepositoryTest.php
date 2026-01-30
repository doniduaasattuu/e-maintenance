<?php

use App\Models\Repository;
use Database\Seeders\RepositorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Repository']);

    $this->seed(RepositorySeeder::class);
});

test('repository index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('repositories.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('repository/index')
        );
});

test('create repository page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('repositories.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('repository/create')
        );
});

test('store repository successfully', function () {

    $title = fake()->sentence();
    $pdf = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('repositories.create'))
        ->post(route('repositories.store'), [
            'title' => $title,
            'file' => $pdf,
        ]);

    $response
        ->assertRedirect(route('repositories.create'));

    assertDatabaseHas('repositories', ['title' => $title]);
});

test('store fails if title is missing', function () {
    $pdf = UploadedFile::fake()->create('document.pdf', 100);

    $response = actingAs(createAdminUser())
        ->post(route('repositories.store'), [
            'title' => '',
            'file' => $pdf,
        ]);

    $response->assertSessionHasErrors(['title']);
});

test('store fails if file is missing', function () {
    $response = actingAs(createAdminUser())
        ->post(route('repositories.store'), [
            'title' => 'Judul Repositori',
            'file' => null,
        ]);

    $response->assertSessionHasErrors(['file']);
});

test('store fails if file size exceeds limit', function () {
    $limit = config('app.maximum_file_upload');
    $largeFile = UploadedFile::fake()->create('heavy.pdf', $limit + 1);

    $response = actingAs(createAdminUser())
        ->post(route('repositories.store'), [
            'title' => 'File Terlalu Besar',
            'file' => $largeFile,
        ]);

    $response->assertSessionHasErrors(['file']);
});

test('edit page accessible', function () {
    $repository = Repository::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('repositories.edit', $repository->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('repository/edit')
                ->has('repository.data')
                ->has('repository.data.id')
                ->has('repository.data.title')
                ->has('repository.data.path')
        );
});

test('update repository successfully', function () {
    $repository = Repository::factory()->create();

    expect($repository)->not()->toBe(null);

    $pdf = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $this
        ->actingAs(createAdminUser())
        ->from(route('repositories.edit', $repository->id))
        ->post(route('repositories.update', $repository->id), [
            'title' => 'Updated Judul Repository',
            'file' => $pdf,
        ]);

    assertDatabaseHas('repositories', ['title' => 'Updated Judul Repository']);
});

test('update repository title without changing the file', function () {
    $repository = Repository::factory()->create();
    $newTitle = 'Hanya Update Judul';

    $response = actingAs(createAdminUser())
        ->post(route('repositories.update', $repository->id), [
            'title' => $newTitle,
            'file'  => null,
        ]);

    $response->assertSessionHasNoErrors();
    assertDatabaseHas('repositories', [
        'id'    => $repository->id,
        'title' => $newTitle,
    ]);
});

test('update fails if title is already taken by another repository', function () {
    Repository::factory()->create(['title' => 'Judul Eksis']);
    $repoSaya = Repository::factory()->create(['title' => 'Judul Saya']);

    $response = actingAs(createAdminUser())
        ->post(route('repositories.update', $repoSaya->id), [
            'title' => 'Judul Eksis',
        ]);

    $response->assertSessionHasErrors(['title']);
});

test('it replaces file and updates path correctly when extension changes', function () {
    Storage::fake('public');

    $oldPath = 'repositories/file_rahasia.pdf';
    Storage::disk('public')->put($oldPath, 'konten pdf lama');

    $repository = Repository::factory()->create([
        'title'     => 'Judul Lama',
        'extension' => 'pdf',
        'path'      => $oldPath,
    ]);

    $newFile = UploadedFile::fake()->create('update_dokumen.xlsx', 100);
    $newExtension = 'xlsx';
    $expectedNewPath = 'repositories/file_rahasia.xlsx';

    $response = actingAs(createAdminUser())
        ->post(route('repositories.update', $repository->id), [
            'title' => 'Judul Baru',
            'file'  => $newFile,
        ]);

    $response->assertRedirect();

    Storage::disk('public')->assertMissing($oldPath);

    Storage::disk('public')->assertExists($expectedNewPath);

    assertDatabaseHas('repositories', [
        'id'        => $repository->id,
        'title'     => 'Judul Baru',
        'extension' => $newExtension,
        'path'      => $expectedNewPath,
    ]);
});

test('it only updates title if no file is uploaded', function () {
    Storage::fake('public');

    $path = 'repositories/tetap.pdf';
    Storage::disk('public')->put($path, 'aman');

    $repository = Repository::factory()->create([
        'title' => 'Judul Awal',
        'path'  => $path,
    ]);

    $this
        ->actingAs(createAdminUser())
        ->post(route('repositories.update', $repository->id), [
            'title' => 'Judul Diganti',
            'file'  => null,
        ]);

    Storage::disk('public')->assertExists($path);

    assertDatabaseHas('repositories', [
        'id'    => $repository->id,
        'title' => 'Judul Diganti',
        'path'  => $path,
    ]);
});

test('can delete repository', function () {
    $repository = Repository::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('repositories.index'))
        ->delete(route('repositories.destroy', $repository->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Repository deleted successfully',
        ]);

    expect(Repository::find($repository->id))->toBeNull();
});
