<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_role']);
    Permission::create(['name' => 'read_role']);
    Permission::create(['name' => 'update_role']);
    Permission::create(['name' => 'delete_role']);
    Permission::create(['name' => 'create_user']);
    Permission::create(['name' => 'read_user']);
    Permission::create(['name' => 'update_user']);
    Permission::create(['name' => 'delete_user']);
    Permission::create(['name' => 'restore_user']);
});

test('index page accessible', function () {
    User::factory()->count(3)->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('users.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('user/index')
                ->has('users.data', 4)
        );
});

test('create page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('users.create'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('user/create')
                ->has('departments')
                ->has('positions')
                ->has('workCenters')
                ->has('availableRoles')
        );
});

test('store successfully with avatar and roles', function () {
    Role::create(['name' => 'UserRole']);

    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('users.create'))
        ->post(route('users.store'), [
            'name' => 'TestName',
            'employee_id' => '12345678',
            'email' => 'test@example.com',
            'phone_number' => '+62812345678',
            'department_id' => null,
            'position_id' => null,
            'work_center_id' => null,
            'avatar' => $file,
            'selectedRoles' => ['UserRole'],
        ]);

    $response->assertRedirect(route('users.create'));

    $user = User::where('email', 'test@example.com')->first();
    expect($user)->not->toBeNull();
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $user->avatar));
    expect($user->roles->pluck('name')->toArray())->toContain('UserRole');
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('users.store'), [
            'name' => '', // required
            'employee_id' => 'abc', // digits:8
            'email' => 'not-an-email',
        ]);

    $response->assertSessionHasErrors(['name', 'employee_id', 'email']);
});

test('edit page accessible', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('users.edit', $user->id));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('user/edit')
                ->has('user.data')
                ->has('departments')
                ->has('positions')
                ->has('workCenters')
                ->has('availableRoles')
                ->has('userRoles')
        );
});

test('update successfully with avatar change and role sync', function () {
    $newRole = Role::create(['name' => 'NewRole']);
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('new.jpg');

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('users.edit', $user->id))
        ->put(route('users.update', $user->id), [
            'name' => 'UpdatedName',
            'employee_id' => (string) $user->employee_id,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'selectedRoles' => ['NewRole'],
            'avatar' => $file,
            'department_id' => null,
            'position_id' => null,
            'work_center_id' => null,
        ]);

    $response->assertRedirect(route('users.edit', $user->id));

    $user->refresh();
    expect($user->name)->toBe('UpdatedName');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $user->avatar));
    expect($user->roles->pluck('name')->toArray())->toContain('NewRole');
});

test('update fails validation', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->put(route('users.update', $user->id), [
            'name' => '',
            'employee_id' => '123',
            'email' => 'bad',
        ]);

    $response->assertSessionHasErrors(['name', 'employee_id', 'email']);
});

test('can soft deletes user', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->delete(route('users.destroy', $user->id));
    $response->assertSessionHas('message.description', 'User deleted successfully');

    expect(User::find($user->id))->toBeNull();
    expect(User::withTrashed()->find($user->id))->not()->toBeNull();
});

test('can restore deleted user', function () {
    $user = User::factory()->create();
    $admin = createAdminUser();

    $response = $this
        ->actingAs($admin)
        ->delete(route('users.destroy', $user->id));
    $response->assertSessionHas('message.description', 'User deleted successfully');

    expect(User::find($user->id))->toBeNull();
    expect(User::withTrashed()->find($user->id))->not()->toBeNull();

    $response = $this
        ->actingAs($admin)
        ->post(route('users.restore', $user->id));
    $response->assertSessionHas('message.description', 'User restored successfully');
});
