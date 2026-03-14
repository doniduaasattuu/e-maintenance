<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;

class MaterialUnit extends Model
{
    /** @use HasFactory<\Database\Factories\MaterialUnitFactory> */
    use HasFactory;

    protected $table = 'material_units';

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

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, 'material_unit_id', 'id');
    }
}
