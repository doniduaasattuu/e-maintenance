<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // ROLES
    Route::resource('roles', RoleController::class);
    Route::post('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::post('users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::resource('users', UserController::class)->except('update');
});
