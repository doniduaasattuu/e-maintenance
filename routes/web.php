<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EquipmentClassController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentStatusController;
use App\Http\Controllers\FunctionalLocationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkCenterController;
use App\Http\Resources\EquipmentClassResource;
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

    Route::resource('roles', RoleController::class);
    Route::post('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::post('/users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::resource('users', UserController::class);

    Route::resource('/functional-locations', FunctionalLocationController::class);
    Route::resource('/equipment-classes', EquipmentClassController::class);
    Route::resource('/equipment-statuses', EquipmentStatusController::class);
    Route::resource('/equipments', EquipmentController::class);

    Route::resource('/organizations/departments', DepartmentController::class)->names([
        'index' => 'departments.index',
        'create' => 'departments.create',
        'edit' => 'departments.edit',
        'update' => 'departments.update',
        'delete' => 'departments.delete',
    ]);

    Route::resource('/organizations/divisions', DivisionController::class)->names([
        'index' => 'divisions.index',
        'create' => 'divisions.create',
        'edit' => 'divisions.edit',
        'update' => 'divisions.update',
        'delete' => 'divisions.delete',
    ]);

    Route::resource('/organizations/work-centers', WorkCenterController::class)->names([
        'index' => 'work-centers.index',
        'create' => 'work-centers.create',
        'edit' => 'work-centers.edit',
        'update' => 'work-centers.update',
        'delete' => 'work-centers.delete',
    ]);
});


Route::fallback(function () {
    return Inertia::render('errors/not-found', [], 404);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
