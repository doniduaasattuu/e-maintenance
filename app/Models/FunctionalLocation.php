<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;

class FunctionalLocation extends Model
{
    use HasFactory;

    protected $table = 'functional_locations';

    protected $fillable = [
        'code',
        'description',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }
    }

    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    public function findings(): HasMany
    {
        return $this->hasMany(Finding::class, 'functional_location_id', 'id');
    }
}
