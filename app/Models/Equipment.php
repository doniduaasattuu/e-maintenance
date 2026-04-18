<?php

namespace App\Models;

use App\Events\EquipmentStatusChanged;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
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

    protected static function booted()
    {
        static::updated(function ($equipment) {
            if ($equipment->isDirty('equipment_status_id') || $equipment->isDirty('functional_location_id')) {
                event(new EquipmentStatusChanged(
                    $equipment,
                    auth()->id()
                ));
            }
        });
    }

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $class = $request->query('class');
        $status = $request->query('status');

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

        if ($class && is_array($class)) {
            $builder->whereHas('eclass', function ($query) use ($class) {
                $query->whereIn('code', $class);
            });
        } elseif ($class && is_string($class)) {
            $builder->whereRelation('eclass', 'code', $class);
        }

        if ($status && is_array($status)) {
            $builder->whereHas('status', function ($query) use ($status) {
                $query->whereIn('code', $status);
            });
        } elseif ($status && is_string($status)) {
            $builder->whereRelation('status', 'code', $status);
        }
    }

    #[Scope]
    public function scopeWithDefaultRelations($query)
    {
        return $query->with([
            'functionalLocation',
            'eclass',
            'status',
        ]);
    }

    public function functionalLocation(): BelongsTo
    {
        return $this->belongsTo(FunctionalLocation::class);
    }

    public function eclass(): BelongsTo
    {
        return $this->belongsTo(EquipmentClass::class, 'equipment_class_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(EquipmentStatus::class, 'equipment_status_id');
    }

    public function installDismantleHistories(): HasMany
    {
        return $this->hasMany(InstallDismantleHistory::class);
    }

    public function inspections(): HasMany
    {
        return $this->hasMany(EquipmentInspectionForm::class);
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'equipment_material', 'equipment_id', 'material_id')
            ->withPivot('id', 'quantity', 'note')
            ->withTimestamps();
    }

    public function repositories(): BelongsToMany
    {
        return $this->belongsToMany(Repository::class);
    }

    public function findings(): HasMany
    {
        return $this->hasMany(Finding::class, 'equipment_id', 'id');
    }
}
