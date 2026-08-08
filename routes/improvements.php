<?php

use App\Http\Controllers\ImprovementCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('improvement-categories', ImprovementCategoryController::class);
});
