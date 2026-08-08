<?php

use App\Http\Controllers\ImprovementCategoryController;
use App\Http\Controllers\ImprovementStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('improvement-categories', ImprovementCategoryController::class);
    Route::resource('improvement-statuses', ImprovementStatusController::class);
});
