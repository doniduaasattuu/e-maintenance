<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;

class FindingPriority extends Model
{
    /** @use HasFactory<\Database\Factories\FindingPriorityFactory> */
    use HasFactory;

    protected $table = 'finding_priorities';

    protected $fillable = [
        "label",
        "sla_resolution_hours",
        "description",
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('label', 'LIKE', "%{$search}%")
                    ->orWhere('sla_resolution_hours', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }
    }

    // public function findings(): HasMany
    // {
    //     return $this->hasMany(Finding::class);
    // }
}
