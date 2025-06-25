<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InstallDismantleHistory extends Model
{
    use HasFactory;

    protected $table = 'install_dismantle_histories';

    protected $fillable = [
        'equipment_id',
        'from_status_id',
        'to_status_id',
        'from_sort_field',
        'to_sort_field',
        'from_functional_location_id',
        'to_functional_location_id',
        'changed_by',
        'changed_at',
        'note',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->whereRelation('equipment', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('sort_field', 'LIKE', "%{$search}%")
                            ->orWhere('description', 'LIKE', "%{$search}%");
                    })
                    ->orWhereRelation('fromStatus', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('name', 'LIKE', "%{$search}%");
                    })
                    ->orWhereRelation('toStatus', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('name', 'LIKE', "%{$search}%");
                    })
                    ->orWhereRelation('fromFunctionalLocation', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('description', 'LIKE', "%{$search}%");
                    })
                    ->orWhereRelation('toFunctionalLocation', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('description', 'LIKE', "%{$search}%");
                    })
                    ->orWhereRelation('changedBy', function (Builder $q) use ($search) {
                        $q
                            ->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('employee_id', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%")
                            ->orWhere('phone_number', 'LIKE', "%{$search}%");
                    });
            });
        }
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function fromStatus(): BelongsTo
    {
        return $this->belongsTo(EquipmentStatus::class, 'from_status_id');
    }

    public function toStatus(): BelongsTo
    {
        return $this->belongsTo(EquipmentStatus::class, 'to_status_id');
    }

    public function fromFunctionalLocation(): BelongsTo
    {
        return $this->belongsTo(FunctionalLocation::class, 'from_functional_location_id');
    }

    public function toFunctionalLocation(): BelongsTo
    {
        return $this->belongsTo(FunctionalLocation::class, 'to_functional_location_id');
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
