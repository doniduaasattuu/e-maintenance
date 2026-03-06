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
        "department_id",
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
            $query->whereRelation('status', 'name', $status);
        });

        $builder->when($priority, function ($query) use ($priority) {
            $query->whereRelation('priority', 'label', $priority);
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

    public function clause(): BelongsTo
    {
        return $this->belongsTo(FindingClause::class, "finding_clause_id");
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(FindingStatus::class, "finding_status_id");
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(FindingPriority::class, "finding_priority_id");
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }

    public function functionalLocation(): BelongsTo
    {
        return $this->belongsTo(FunctionalLocation::class, 'functional_location_id');
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(FindingImage::class);
    }
}
