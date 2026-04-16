<?php

use App\Http\Controllers\FunctionalLocationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('functional-locations/export', [FunctionalLocationController::class, 'export'])->name('functional-locations.export');
    Route::resource('functional-locations', FunctionalLocationController::class);
});
