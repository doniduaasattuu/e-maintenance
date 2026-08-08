<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;

class ImprovementStatus extends Model
{
    /** @use HasFactory<\Database\Factories\ImprovementStatusFactory> */
    use HasFactory;

    protected $table = 'improvement_statuses';

    protected $fillable = [
        'name',
        'color',
        'sequence',
    ];


    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('color', 'LIKE', "%{$search}%");
            });
        }
    }

    // public function improvements(): HasMany {
    //     return $this->hasMany(Improvement::class);
    // }
}
