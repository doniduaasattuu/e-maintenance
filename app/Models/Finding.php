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
        "finding_type_id",
        "finding_clause_id",
        "finding_status_id",
        "finding_priority_id",
        "cause_code_id",
        "department_id",
        "equipment_id",
        "work_center_id",
        "functional_location_id",
        "description",
        "rectification_action",
        "notification",
        "inspected_by",
        "rectified_by",
        "verified_by",
        "closed_at",
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $clause = $request->query('clause');
        $causeCode = $request->query('causeCode');
        $status = $request->query('status');
        $priority = $request->query('priority');
        $department = $request->query('department');
        $workCenter = $request->query('work-center');

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('description', 'LIKE', "%{$search}%")
                    ->orWhere('notification', 'LIKE', "%{$search}%")
                    ->orWhere('rectification_action', 'LIKE', "%{$search}%")
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

        if ($clause && is_array($clause)) {
            $builder->whereHas('clause', function ($query) use ($clause) {
                $query->whereIn('code', $clause);
            });
        } elseif ($clause && is_string($clause)) {
            $builder->whereRelation('clause', 'code', $clause);
        }

        if ($causeCode && is_array($causeCode)) {
            $builder->whereHas('causeCode', function ($query) use ($causeCode) {
                $query->whereIn('code', $causeCode);
            });
        } elseif ($causeCode && is_string($causeCode)) {
            $builder->whereRelation('causeCode', 'code', $causeCode);
        }

        if ($status && is_array($status)) {
            $builder->whereHas('status', function ($query) use ($status) {
                $query->whereIn('name', $status);
            });
        } elseif ($status && is_string($status)) {
            $builder->whereRelation('status', 'name', $status);
        }

        if ($priority && is_array($priority)) {
            $builder->whereHas('priority', function ($query) use ($priority) {
                $query->whereIn('label', $priority);
            });
        } elseif ($priority && is_string($priority)) {
            $builder->whereRelation('priority', 'label', $priority);
        }

        if ($department && is_array($department)) {
            $builder->whereHas('department', function ($query) use ($department) {
                $query->whereIn('code', $department);
            });
        } elseif ($department && is_string($department)) {
            $builder->whereRelation('department', 'code', $department);
        }

        if ($workCenter && is_array($workCenter)) {
            $builder->whereHas('workCenter', function ($query) use ($workCenter) {
                $query->whereIn('code', $workCenter);
            });
        } elseif ($workCenter && is_string($workCenter)) {
            $builder->whereRelation('workCenter', 'code', $workCenter);
        }
    }

    #[Scope]
    public function scopeForUserDepartment($query)
    {
        $user = auth()->user();
        if (!$user) {
            return $query;
        }

        // Menggunakan hasPermissionTo terkadang melempar error jika data permission belum di-seed di test db.
        // Alternatif aman: Cek relasi permissions secara langsung di collection, atau bungkus dengan check.
        $hasViewAllPermission = false;
        try {
            $hasViewAllPermission = $user->hasPermissionTo('view_all_finding');
        } catch (\Spatie\Permission\Exceptions\PermissionDoesNotExist $e) {
            // Jika di lingkungan test permission belum dibuat, abaikan errornya
            $hasViewAllPermission = false;
        }

        if ($user->hasRole('Admin') || $hasViewAllPermission) {
            return $query;
        }

        $userDeptId = auth()->user()->department_id;
        $userId = auth()->id();

        return $query->where(function ($q) use ($userDeptId, $userId) {
            $q->where(function ($subQ) use ($userDeptId) {
                $subQ->where('department_id', $userDeptId)
                    ->orWhereNull('department_id');
            })
                ->orWhere('inspected_by', $userId);
        });
    }

    #[Scope]
    public function scopeOfType($query, string $typeCode)
    {
        return $query->whereHas('type', fn($q) => $q->where('code', $typeCode));
    }

    #[Scope]
    public function scopeOpen($query)
    {
        return $query->whereHas('status', fn($q) => $q->where('name', 'Open'));
    }

    #[Scope]
    public function scopeActive($query)
    {
        return $query->whereHas('status', fn($q) => $q->where('name', '!=', 'Closed'));
    }

    #[Scope]
    public function scopeArchived($query)
    {
        return $query->whereHas('status', fn($q) => $q->where('name', 'Closed'));
    }

    #[Scope]
    public function scopeWithDefaultRelations($query)
    {
        return $query->with([
            'type',
            'clause',
            'status',
            'priority',
            'causeCode',
            'inspector',
            'verifier',
            'images',
        ]);
    }

    #[Scope]
    public function scopeWithAllRelations($query)
    {
        return $query->with([
            'type',
            'clause',
            'status',
            'priority',
            'causeCode',
            'department',
            'workCenter',
            'equipment',
            'functionalLocation',
            'inspector',
            'rectifier',
            'verifier',
            'images',
        ]);
    }

    #[Scope]
    public function scopeOfAreas(Builder $query, array $areas): Builder
    {
        return $query->whereHas('functionalLocation', function ($q) use ($areas) {
            $q->where(function ($subQuery) use ($areas) {
                foreach ($areas as $area) {
                    if (!empty($area)) {
                        $subQuery->orWhere('code', 'LIKE', $area . '%');
                    }
                }
            });
        });
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(FindingType::class, "finding_type_id");
    }

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

    public function causeCode(): BelongsTo
    {
        return $this->belongsTo(CauseCode::class, "cause_code_id");
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function workCenter(): BelongsTo
    {
        return $this->belongsTo(WorkCenter::class, 'work_center_id');
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

    public function rectifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rectified_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(FindingImage::class);
    }

    // CHART
    public static function getChartData($model)
    {
        return $model::query()
            ->select('id', 'code')
            ->withCount(['findings as totalClosedFindings' => function ($query) {
                // Gunakan logic archived/closed di sini
                $query->whereHas('status', fn($q) => $q->where('name', 'Closed'));
            }])
            ->limit(10)
            ->get()
            ->map(function ($dept) {
                return [
                    'code' => $dept->code,
                    'totalClosedFindings' => $dept->totalClosedFindings,
                ];
            })
            ->sortByDesc('totalClosedFindings')
            ->values();
    }

    public static function getTopInspectors()
    {
        return \App\Models\User::query()
            ->select('id', 'name')
            ->withCount(['inspectedFindings as totalSolved'])
            ->whereHas('inspectedFindings', function ($query) {
                $query->whereHas('status', fn($q) => $q->where('name', 'Closed'));
            })
            ->orderByDesc('totalSolved')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => str()->before($user->name, ' '),
                    'totalSolved' => $user->totalSolved,
                ];
            })
            ->values();
    }

    public static function getTopResolvers()
    {
        return \App\Models\User::query()
            ->select('id', 'name')
            ->withCount(['rectifiedFindings as totalSolved' => function ($query) {
                $query->whereHas('status', fn($q) => $q->where('name', 'Closed'));
            }])
            ->whereHas('rectifiedFindings', function ($query) {
                $query->whereHas('status', fn($q) => $q->where('name', 'Closed'));
            })
            ->orderByDesc('totalSolved')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => str()->before($user->name, ' '),
                    'totalSolved' => $user->totalSolved,
                ];
            })
            ->values();
    }
}
