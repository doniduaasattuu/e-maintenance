<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plant extends Model
{
    use HasFactory;

    protected $table = 'plants';

    protected $fillable = [
        'code',
        'name',
        'sort_order',
    ];

    public function functionalLocations(): HasMany
    {
        return $this->hasMany(FunctionalLocation::class);
    }
}
