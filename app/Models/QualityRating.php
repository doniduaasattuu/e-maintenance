<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QualityRating extends Model
{
    /** @use HasFactory<\Database\Factories\QualityRatingFactory> */
    use HasFactory;

    protected $table = 'quality_ratings';

    protected $fillable = [
        'name',
        'description',
    ];
}
