<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FindingPriority extends Model
{

    protected $table = 'finding_priorities';

    protected $fillable = [
        "label",
        "description",
        "sla_resolution_hours",
        "color_code",
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
                    ->orWhere('color_code', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }
    }

    public function findings(): HasMany
    {
        return $this->hasMany(Finding::class, 'finding_priority_id', 'id');
    }
}
