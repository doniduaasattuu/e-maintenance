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

    public function repositories(): BelongsToMany
    {
        return $this->belongsToMany(Repository::class);
    }
}
