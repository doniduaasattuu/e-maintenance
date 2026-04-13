<?php

use App\Http\Controllers\FunctionalLocationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('functional-locations', FunctionalLocationController::class);
});
