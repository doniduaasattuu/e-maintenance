<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // EXPORT
    Route::get('users/export', [UserController::class, 'export'])->name('users.export');

    // ROLES
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    Route::post('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::post('users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::post('users/{id}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset.password');
    Route::resource('users', UserController::class)->except('update');
});
