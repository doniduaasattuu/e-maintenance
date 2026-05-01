<?php

use App\Http\Controllers\FunctionalLocationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // EXPORT
    Route::get('functional-locations/export', [FunctionalLocationController::class, 'export'])->name('functional-locations.export');
    Route::get('functional-locations/findings/export', [FunctionalLocationController::class, 'functionalLocationFindingExport'])->name('functional-locations.findings.export');

    Route::resource('functional-locations', FunctionalLocationController::class);
});
