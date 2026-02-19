<?php

// use Database\Seeders\RoleSeeder;
// use Illuminate\Foundation\Testing\RefreshDatabase;

// uses(RefreshDatabase::class);

// beforeEach(function () {
//     $this->seed(RoleSeeder::class);
// });


test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users cannot register if register key is null', function () {
    $response = $this->post('/register', [
        'employee_id' => (string) fake()->randomNumber(8, true),
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'registration_key' => null,
    ]);

    $response->assertSessionHasErrors(['registration_key' => 'The registration key field is required.']);
});

test('new users cannot register if register key is wrong', function () {
    $response = $this->post('/register', [
        'employee_id' => (string) fake()->randomNumber(8, true),
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'registration_key' => 'RGS&*AX<AA(',
    ]);

    $response->assertSessionHasErrors(['registration_key' => 'Your registration key is wrong.']);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'employee_id' => (string) fake()->randomNumber(8, true),
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'registration_key' => config('services.registration_key'),
    ]);

    $response->assertSessionHasNoErrors(['registration_key']);
});
