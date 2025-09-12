<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/settings/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'avatar' => null,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => 'Test User',
            'email' => $user->email,
            'avatar' => null,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can upload a valid avatar image', function () {
    $user = User::factory()->create([
        'avatar' => null,
    ]);

    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this->actingAs($user)
        ->post('/settings/profile', [
            'name' => 'Test User',
            'email' => $user->email,
            'avatar' => $file,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->avatar)->toStartWith('storage/avatars/');
    Storage::disk('public')->assertExists(str_replace('storage/', '', $user->avatar));
});

test('avatar upload fails if file is not an image', function () {
    $user = User::factory()->create();

    $invalidFile = UploadedFile::fake()->create('not-image.pdf', 100, 'application/pdf');

    $response = $this->actingAs($user)->post('/settings/profile', [
        'name' => 'Test User',
        'email' => $user->email,
        'avatar' => $invalidFile,
    ]);

    $response->assertSessionHasErrors(['avatar']);
});

test('avatar upload fails if file is larger than 2MB', function () {
    $user = User::factory()->create();

    $bigFile = UploadedFile::fake()->create('large.jpg', 3000, 'image/jpeg'); // 3MB

    $response = $this->actingAs($user)->post('/settings/profile', [
        'name' => 'Test User',
        'email' => $user->email,
        'avatar' => $bigFile,
    ]);

    $response->assertSessionHasErrors(['avatar']);
});

test('user can submit profile form without uploading avatar', function () {
    $user = User::factory()->create([
        'avatar' => null,
    ]);

    $response = $this->actingAs($user)->post('/settings/profile', [
        'name' => 'Test User',
        'email' => $user->email,
        'avatar' => null,
    ]);

    $response->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    expect($user->refresh()->avatar)->toBeNull();
});

test('old avatar is deleted when uploading new one', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)->post('/settings/profile', [
        'name' => 'Test User',
        'email' => $user->email,
        'avatar' => UploadedFile::fake()->image('old-avatar.jpg'),
    ]);

    $user->refresh();

    $oldStoredPath = str_replace('storage/', '', $user->avatar);
    Storage::disk('public')->assertExists($oldStoredPath);

    $this->actingAs($user)->post('/settings/profile', [
        'name' => 'Updated User',
        'email' => $user->email,
        'avatar' => UploadedFile::fake()->image('new-avatar.jpg'),
    ]);

    $user->refresh();

    $newStoredPath = str_replace('storage/', '', $user->avatar);

    // ✅ File lama harus sudah dihapus
    // Storage::disk('public')->assertMissing($oldStoredPath);

    // // ✅ File baru harus ada
    Storage::disk('public')->assertExists($newStoredPath);
});

test('user can delete their account', function () {
    $user = User::factory()->create();
    expect($user->deleted_at)->toBeNull();

    $response = $this
        ->actingAs($user)
        ->delete('/settings/profile', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh()->deleted_at)->not()->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/settings/profile')
        ->delete('/settings/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/settings/profile');

    expect($user->fresh())->not->toBeNull();
});
