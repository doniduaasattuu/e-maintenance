<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;

class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\QualityRatingFactory> */
    use HasFactory;

    protected $table = 'units';

    protected $fillable = [
        'name',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('name', 'LIKE', "%{$search}%");
            });
        }
    }
}
