<?php

use App\Http\Controllers\ImprovementCategoryController;
use App\Http\Controllers\ImprovementController;
use App\Http\Controllers\ImprovementStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::post(
        'improvements/{improvement}/submit',
        [ImprovementController::class, 'submit']
    )->name('improvements.submit');

    Route::post(
        'improvements/{improvement}/implement',
        [ImprovementController::class, 'implement']
    )->name('improvements.implement');

    Route::post(
        'improvements/{improvement}/approve',
        [ImprovementController::class, 'approve']
    )->name('improvements.approve');

    Route::post(
        'improvements/{improvement}/verify',
        [ImprovementController::class, 'verify']
    )->name('improvements.verify');

    Route::post(
        'improvements/{improvement}/reject',
        [ImprovementController::class, 'reject']
    )->name('improvements.reject');


    Route::resource('improvement-categories', ImprovementCategoryController::class);
    Route::resource('improvement-statuses', ImprovementStatusController::class);

    Route::post('improvements/{improvement}', [ImprovementController::class, 'update'])->name('improvements.update');
    Route::resource('improvements', ImprovementController::class)->except('update');
});
