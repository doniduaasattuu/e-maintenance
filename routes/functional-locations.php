<?php

use App\Http\Controllers\FunctionalLocationController;
use App\Http\Controllers\FunctionalLocationFindingController;
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('functional-locations')->group(function () {
        // IMAGE
        Route::get('{id}/images/{type}', [ImageController::class, 'index'])->name('images.functional-location.index');
        Route::post('{id}/images/{type}', [ImageController::class, 'store'])->name('images.functional-location.store');
        // EXPORT
        Route::get('export', [FunctionalLocationController::class, 'export'])->name('functional-locations.export');
        Route::get('{functionalLocation}/findings', [FunctionalLocationFindingController::class, 'show'])->name('functional-locations.findings');
        Route::get('findings/export', [FunctionalLocationFindingController::class, 'export'])->name('functional-locations.findings.export');
    });

    Route::resource('functional-locations', FunctionalLocationController::class);
});
