<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('welcome');

    return redirect('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware('role:Admin')->group(function () {
        Route::resource('roles', RoleController::class);
    });
});


Route::fallback(function () {
    return Inertia::render('errors/not-found', [], 404);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
