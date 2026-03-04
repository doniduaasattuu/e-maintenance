<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Finding extends Model
{
    /** @use HasFactory<\Database\Factories\FindingFactory> */
    use HasFactory;

    protected $table = 'findings';

    protected $fillable = [
        "finding_clause_id",
        "finding_status_id",
        "finding_priority_id",
        "equipment_id",
        "functional_location_id",
        "description",
        "notification",
        "inspected_by",
        "verified_by",
        "closed_at",
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $status = trim($request->query('status'));
        $priority = trim($request->query('priority'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('description', 'LIKE', "%{$search}%")
                    ->orWhere('notification', 'LIKE', "%{$search}%")
                    ->orwhereRelation('equipment', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('sort_field', 'LIKE', "%{$search}%")
                            ->orWhere('description', 'LIKE', "%{$search}%");
                    })
                    ->orwhereRelation('functionalLocation', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('description', 'LIKE', "%{$search}%");
                    });
            });
        }

        $builder->when($status, function ($query) use ($status) {
            $query->whereRelation('findingStatus', 'name', $status);
        });

        $builder->when($priority, function ($query) use ($priority) {
            $query->whereRelation('findingPriority', 'label', $priority);
        });
    }

    // public function imagesBefore(): HasMany
    // {
    //     return $this->hasMany(FindingImage::class)->where('category', 'before');
    // }

    // public function imagesAfter(): HasMany
    // {
    //     return $this->hasMany(FindingImage::class)->where('category', 'after');
    // }

    public function findingClause(): BelongsTo
    {
        return $this->belongsTo(FindingClause::class);
    }

    public function findingStatus(): BelongsTo
    {
        return $this->belongsTo(FindingStatus::class);
    }

    public function findingPriority(): BelongsTo
    {
        return $this->belongsTo(FindingPriority::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function functionalLocation(): BelongsTo
    {
        return $this->belongsTo(FunctionalLocation::class);
    }

    public function inspectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(FindingImage::class);
    }
}
