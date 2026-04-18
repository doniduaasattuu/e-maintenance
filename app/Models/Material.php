<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Request;

class Material extends Model
{
    /** @use HasFactory<\Database\Factories\MaterialFactory> */
    use HasFactory;

    protected $table = 'materials';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'price',
        'material_unit_id',
        'material_type_id',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $unit = $request->query('unit');
        $type = $request->query('type');

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%")
                    ->orWhere('price', 'LIKE', "%{$search}%");
            });
        }

        if ($unit && is_array($unit)) {
            $builder->whereHas('unit', function ($query) use ($unit) {
                $query->whereIn('name', $unit);
            });
        } elseif ($unit && is_string($unit)) {
            $builder->whereRelation('unit', 'name', $unit);
        }

        if ($type && is_array($type)) {
            $builder->whereHas('type', function ($query) use ($type) {
                $query->whereIn('code', $type);
            });
        } elseif ($type && is_string($type)) {
            $builder->whereRelation('type', 'code', $type);
        }
    }

    #[Scope]
    public function scopeWithDefaultRelations($query)
    {
        return $query->with([
            'unit',
            'type',
        ]);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(MaterialUnit::class, 'material_unit_id');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(MaterialType::class, 'material_type_id');
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function repositories(): BelongsToMany
    {
        return $this->belongsToMany(Repository::class);
    }

    public function equipments(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'equipment_material', 'material_id', 'equipment_id')
            ->withPivot('id', 'quantity', 'note')
            ->withTimestamps();
    }
}
