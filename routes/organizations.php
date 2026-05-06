<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\WorkCenterController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // ORGANIZATIONS
    Route::prefix('organizations')->group(function () {
        // DEPARTMENT
        Route::get('departments/export', [DepartmentController::class, 'export'])->name('departments.export');
        Route::resource('departments', DepartmentController::class)->names([
            'index' => 'departments.index',
            'create' => 'departments.create',
            'store' => 'departments.store',
            'edit' => 'departments.edit',
            'update' => 'departments.update',
            'destroy' => 'departments.destroy',
        ])->only([
            'index',
            'create',
            'store',
            'edit',
            'update',
            'destroy',
        ]);

        // DIVISION
        Route::get('divisions/export', [DivisionController::class, 'export'])->name('divisions.export');
        Route::resource('divisions', DivisionController::class)->names([
            'index' => 'divisions.index',
            'create' => 'divisions.create',
            'store' => 'divisions.store',
            'edit' => 'divisions.edit',
            'update' => 'divisions.update',
            'destroy' => 'divisions.destroy',
        ])->only([
            'index',
            'create',
            'store',
            'edit',
            'update',
            'destroy',
        ]);

        // WORK CENTER
        Route::get('work-centers/export', [WorkCenterController::class, 'export'])->name('work-centers.export');
        Route::resource('work-centers', WorkCenterController::class)->names([
            'index' => 'work-centers.index',
            'create' => 'work-centers.create',
            'store' => 'work-centers.store',
            'edit' => 'work-centers.edit',
            'update' => 'work-centers.update',
            'destroy' => 'work-centers.destroy',
        ])->only([
            'index',
            'create',
            'store',
            'edit',
            'update',
            'destroy',
        ]);
    });
});
