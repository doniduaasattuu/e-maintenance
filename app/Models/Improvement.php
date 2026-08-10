<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Improvement extends Model
{
    /** @use HasFactory<\Database\Factories\ImprovementFactory> */
    use HasFactory;

    protected $table = 'improvements';

    protected $fillable = [
        'functional_location_id',
        'equipment_id',
        'department_id',
        'improvement_category_id',
        'improvement_status_id',
        'code',
        'title',
        'problem',
        'description',
        'root_cause',
        'expected_benefit',
        'actual_benefit',
        'implementation_date',
        'remarks',
        'images',
        'created_by',
        'approved_by',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $category = $request->query('category');
        $status = $request->query('status');

        if ($search) {
            $builder->where(function (Builder $query) use ($search) {
                $query
                    ->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('title', 'LIKE', "%{$search}%")
                    ->orWhere('problem', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhere('root_cause', 'LIKE', "%{$search}%");
            });
        }

        if ($category && is_array($category)) {
            $builder->whereHas('category', function ($query) use ($category) {
                $query->whereIn('name', $category);
            });
        } elseif ($category && is_string($category)) {
            $builder->whereRelation('category', 'name', $category);
        }

        if ($status && is_array($status)) {
            $builder->whereHas('status', function ($query) use ($status) {
                $query->whereIn('name', $status);
            });
        } elseif ($status && is_string($status)) {
            $builder->whereRelation('status', 'name', $status);
        }
    }

    #[Scope]
    public function scopeWithAllRelations($query)
    {
        return $query->with([
            'functionalLocation',
            'equipment',
            'department',

            'category',
            'status',
            'creator',
            'approver',
            'images',
        ]);
    }

    public function functionalLocation(): BelongsTo
    {
        return $this->belongsTo(FunctionalLocation::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ImprovementCategory::class, 'improvement_category_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ImprovementStatus::class, 'improvement_status_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ImprovementImage::class);
    }
}
