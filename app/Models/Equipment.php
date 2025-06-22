<?php

namespace App\Models;

use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipments';

    protected $fillable = [
        'code',
        'sort_field',
        'description',
        'functional_location_id',
        'equipment_class_id',
        'equipment_status_id',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $class = trim($request->query('class'));
        $status = trim($request->query('status'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('sort_field', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orwhereRelation('functionalLocation', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('description', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($class) {
            $builder->whereRelation('equipmentClass', 'code', $class);
        }

        if ($status) {
            $builder->whereRelation('equipmentStatus', 'code', $status);
        }
    }

    public function functionalLocation(): BelongsTo
    {
        return $this->belongsTo(FunctionalLocation::class);
    }

    public function equipmentClass(): BelongsTo
    {
        return $this->belongsTo(EquipmentClass::class);
    }

    public function equipmentStatus(): BelongsTo
    {
        return $this->belongsTo(EquipmentStatus::class);
    }
}
