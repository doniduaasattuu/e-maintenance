<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using email on the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'identifier' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    event(new \App\Events\UserActivityDetected($user->fresh()));

    expect($user->refresh()->isOnline())->toBe(true);
});

test('users can authenticate using user id on the login screen', function () {
    $user = User::factory()->create([
        'employee_id' => '12345678'
    ]);

    $this->assertNotNull($user->employee_id);

    $response = $this->post('/login', [
        'identifier' => $user->employee_id,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    event(new \App\Events\UserActivityDetected($user->fresh()));

    expect($user->refresh()->isOnline())->toBe(true);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'identifier' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
