<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;

class EquipmentType extends Model
{
    use HasFactory;

    protected $table = 'equipment_types';

    protected $fillable = [
        'equipment_class_id',
        'code',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }
    }

    public function equipmentClass(): BelongsTo
    {
        return $this->belongsTo(EquipmentClass::class);
    }

    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }
}
