<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

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
                    ->where('id', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
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
            ->select('id', 'code', 'name')
            ->withCount(['findings as totalClosedFindings' => function ($query) {
                $query->whereHas('status', fn($q) => $q->where('name', 'Closed'));
            }])
            ->limit(10)
            ->get()
            ->map(function ($dept) {
                return [
                    'code' => $dept->code,
                    'name' => $dept->name,
                    'totalClosedFindings' => $dept->totalClosedFindings,
                ];
            })
            ->sortByDesc('totalClosedFindings')
            ->values();
    }

    public static function getTopInspectorsWeekly(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate,
        int $selectedWeek
    ) {

        $query = User::query()
            ->select('id', 'name')
            ->withCount([
                'inspectedFindings as totalFindings' => function ($query) use (
                    $startDate,
                    $endDate,
                    $selectedWeek
                ) {

                    $query
                        ->whereBetween('created_at', [$startDate, $endDate]);

                    switch ($selectedWeek) {

                        case 1:
                            $query->whereDay('created_at', '<=', 7);
                            break;

                        case 2:
                            $query->whereBetween(DB::raw('DAY(created_at)'), [8, 14]);
                            break;

                        case 3:
                            $query->whereBetween(DB::raw('DAY(created_at)'), [15, 21]);
                            break;

                        case 4:
                            $query->whereBetween(DB::raw('DAY(created_at)'), [22, 28]);
                            break;

                        case 5:
                            $query->whereDay('created_at', '>=', 29);
                            break;
                    }
                }
            ])
            ->having('totalFindings', '>', 0)
            ->orderByDesc('totalFindings')
            ->limit(10)
            ->get();

        return $query->map(function ($user) {

            return [
                'name' => str($user->name)->before(' '),
                'totalFindings' => $user->totalFindings,
            ];
        })->values();
    }

    public static function getTopInspectors(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        return User::query()
            ->select('id', 'name')
            ->withCount([
                'inspectedFindings as totalFindings' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }
            ])
            ->whereHas('inspectedFindings', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderByDesc('totalFindings')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => str($user->name)->before(' '),
                    'totalFindings' => $user->totalFindings,
                ];
            })
            ->values();
    }

    public static function getTopResolvers(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        return User::query()
            ->select('id', 'name')
            ->withCount([
                'rectifiedFindings as totalSolved' => function ($query) use ($startDate, $endDate) {
                    $query
                        ->whereBetween('closed_at', [$startDate, $endDate])
                        ->whereHas('status', function ($q) {
                            $q->where('name', 'Closed');
                        });
                }
            ])
            ->whereHas('rectifiedFindings', function ($query) use ($startDate, $endDate) {
                $query
                    ->whereBetween('closed_at', [$startDate, $endDate])
                    ->whereHas('status', function ($q) {
                        $q->where('name', 'Closed');
                    });
            })
            ->orderByDesc('totalSolved')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => str($user->name)->before(' '),
                    'totalSolved' => $user->totalSolved,
                ];
            })
            ->values();
    }

    public static function getTopFindingAreas(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate)
    {
        return Finding::query()
            ->join(
                'functional_locations',
                'findings.functional_location_id',
                '=',
                'functional_locations.id'
            )
            ->select(
                'functional_locations.code',
                'functional_locations.description',
                DB::raw('COUNT(findings.id) as total_findings')
            )
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'functional_locations.id',
                'functional_locations.code',
                'functional_locations.description'
            )
            ->orderByDesc('total_findings')
            ->limit(5)
            ->get()
            ->values()
            ->map(function ($item, $index) {

                return [
                    // format standar Recharts
                    'name' => $item->code,
                    'value' => (int) $item->total_findings,

                    // informasi tambahan
                    'description' => $item->description,

                    // tetap simpan jika diperlukan komponen lain
                    'label' => $item->description,

                    'fill' => 'var(--chart-' . (($index % 5) + 1) . ')',
                ];
            });
    }

    public static function getStats()
    {
        $totalFindings = Finding::count();
        $open = FindingStatus::where('name', 'Open')->first();
        $closed = FindingStatus::where('name', 'Closed')->first();

        // 2. Open Findings (Belum ditutup)
        $openFindings = Finding::where('finding_status_id', $open->id)->count();

        // 3. Closed Findings (Sudah ditutup)
        $closedFindings = Finding::where('finding_status_id', $closed->id)->count();

        // 4. Logika Perbandingan (Contoh: Dibandingkan dengan bulan lalu)
        $lastMonth = Finding::where('created_at', '<', \Illuminate\Support\Carbon::now()->subMonth())->count();
        $diff = $totalFindings - $lastMonth;

        $slaExceeded = Finding::whereNull('closed_at')
            ->with('priority')
            ->get()
            ->filter(function ($finding) {
                $deadline = \Illuminate\Support\Carbon::parse($finding->created_at)
                    ->addHours($finding->priority->sla_resolution_hours);
                return $deadline->isPast();
            })
            ->count();

        return [
            'totalFindings' => $totalFindings,
            'openFindings' => $openFindings,
            'closedFindings' => $closedFindings,
            'diff' => $diff,
            'slaExceeded' => $slaExceeded,
        ];
    }

    public static function getMonthlyFinding()
    {

        $monthlyFindings = Finding::query()
            ->leftJoin(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->selectRaw("
        YEAR(findings.created_at) as year,
        MONTH(findings.created_at) as month,

        SUM(CASE
            WHEN finding_statuses.name = 'Closed'
            THEN 1 ELSE 0
        END) as closed,

        SUM(CASE
            WHEN finding_statuses.name <> 'Closed'
            THEN 1 ELSE 0
        END) as open
    ")
            ->where(
                'findings.created_at',
                '>=',
                now()->subMonths(11)->startOfMonth()
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $chartMonthlyFindings = collect();

        $date = \Illuminate\Support\Carbon::create(
            now()->year,
            now()->month,
            1
        );

        for ($i = 11; $i >= 0; $i--) {

            $d = $date
                ->copy()
                ->subMonthsNoOverflow($i);

            $row = $monthlyFindings->first(function ($item) use ($d) {
                return $item->year == $d->year
                    && $item->month == $d->month;
            });

            $open = (int) ($row?->open ?? 0);
            $closed = (int) ($row?->closed ?? 0);

            $chartMonthlyFindings->push([
                'month' => $d->format('M'),
                'closed' => (int) ($row->closed ?? 0),
                'open' => (int) ($row->open ?? 0),
                'closing_rate' => ($open + $closed) > 0
                    ? round(($closed / ($open + $closed)) * 100)
                    : 0,
            ]);
        }

        $seriesMonthlyFindings = [
            [
                'key' => 'closed',
                'label' => 'Closed',
                'color' => 'var(--chart-2)',
            ],
            [
                'key' => 'open',
                'label' => 'Open',
                'color' => 'var(--chart-5)',
            ],
        ];

        return [
            'chart' => $chartMonthlyFindings,
            'series' => $seriesMonthlyFindings,
        ];
    }


    public static function getWeeklyFinding(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate)
    {

        $weeklyFindings = Finding::query()
            ->selectRaw('FLOOR((DAY(created_at)-1)/7)+1 as week_number,
        COUNT(*) as total')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('week_number')
            ->orderBy('week_number')
            ->get();

        $chartWeeklyFindings = collect();
        $weeklyTotal = 0;

        for ($week = 1; $week <= 5; $week++) {

            $row = $weeklyFindings->firstWhere(
                'week_number',
                $week
            );

            $chartWeeklyFindings->push([
                'week' => "W-{$week}",
                'value' => $row?->total ?? 0,
            ]);

            $weeklyTotal += $row?->total ?? 0;
        }

        $chartWeeklyFindings->push([
            'week' => 'Total',
            'value' => $weeklyTotal,
        ]);

        return [
            'chart' => $chartWeeklyFindings,
        ];
    }

    public static function getStatusWeekly(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate)
    {

        $statusFindings = Finding::query()
            ->join(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->selectRaw("
        CASE
            WHEN DAY(findings.created_at) BETWEEN 1 AND 7 THEN 1
            WHEN DAY(findings.created_at) BETWEEN 8 AND 14 THEN 2
            WHEN DAY(findings.created_at) BETWEEN 15 AND 21 THEN 3
            WHEN DAY(findings.created_at) BETWEEN 22 AND 28 THEN 4
            ELSE 5
        END as week_number,

        finding_statuses.id,
        finding_statuses.name,

        COUNT(*) as total
    ")
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'week_number',
                'finding_statuses.id',
                'finding_statuses.name'
            )
            ->orderBy('week_number')
            ->orderBy('finding_statuses.id')
            ->get();

        $chartStatusWeekly = collect();

        $totals = [
            'open' => 0,
            'inProgress' => 0,
            'onHold' => 0,
            'review' => 0,
            'closed' => 0,
        ];

        for ($week = 1; $week <= 5; $week++) {

            $row = [
                'week' => "W-{$week}",

                'open' => 0,
                'inProgress' => 0,
                'onHold' => 0,
                'review' => 0,
                'closed' => 0,
            ];

            foreach (
                $statusFindings
                    ->where('week_number', $week)
                as $status
            ) {

                switch ($status->id) {

                    case 1:
                        $row['open'] = (int)$status->total;
                        $totals['open'] += $status->total;
                        break;

                    case 2:
                        $row['inProgress'] = (int)$status->total;
                        $totals['inProgress'] += $status->total;
                        break;

                    case 3:
                        $row['onHold'] = (int)$status->total;
                        $totals['onHold'] += $status->total;
                        break;

                    case 4:
                        $row['review'] = (int)$status->total;
                        $totals['review'] += $status->total;
                        break;

                    case 5:
                        $row['closed'] = (int)$status->total;
                        $totals['closed'] += $status->total;
                        break;
                }
            }

            $chartStatusWeekly->push($row);
        }

        $chartStatusWeekly->push([
            'week' => 'Total',

            'open' => $totals['open'],
            'inProgress' => $totals['inProgress'],
            'onHold' => $totals['onHold'],
            'review' => $totals['review'],
            'closed' => $totals['closed'],
        ]);

        return [
            'chart' => $chartStatusWeekly,
        ];
    }

    public static function getPriorityWeekly(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate)
    {

        $priorities = \App\Models\FindingPriority::query()
            ->orderBy('id')
            ->get();

        $priorityFindings = Finding::query()
            ->join(
                'finding_priorities',
                'findings.finding_priority_id',
                '=',
                'finding_priorities.id'
            )
            ->selectRaw("
        CASE
            WHEN DAY(findings.created_at) BETWEEN 1 AND 7 THEN 1
            WHEN DAY(findings.created_at) BETWEEN 8 AND 14 THEN 2
            WHEN DAY(findings.created_at) BETWEEN 15 AND 21 THEN 3
            WHEN DAY(findings.created_at) BETWEEN 22 AND 28 THEN 4
            ELSE 5
        END as week_number,

        finding_priorities.label,

        COUNT(*) as total
    ")
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'week_number',
                'finding_priorities.label'
            )
            ->orderBy('week_number')
            ->get();

        $prioritySeries = collect();

        foreach ($priorities as $priority) {

            $key = \Illuminate\Support\Str::slug($priority->label, '_');

            $prioritySeries->push([
                'key'   => $key,
                'label' => $priority->label,
                'color' => $priority->color_code,
            ]);
        }

        $totals = [];

        foreach ($prioritySeries as $series) {
            $totals[$series['key']] = 0;
        }

        $chartPriorityWeekly = collect();

        for ($week = 1; $week <= 5; $week++) {

            $row = [
                'week' => "W-{$week}",
            ];

            $weekTotal = 0;

            foreach ($prioritySeries as $series) {

                $total = optional(
                    $priorityFindings
                        ->where('week_number', $week)
                        ->firstWhere('label', $series['label'])
                )->total ?? 0;

                $row[$series['key']] = (int) $total;

                $weekTotal += $total;

                $totals[$series['key']] += $total;
            }

            // Hitung persentase setiap priority
            foreach ($prioritySeries as $series) {

                $key = $series['key'];

                $row[$key . '_percent'] = $weekTotal > 0
                    ? round(($row[$key] / $weekTotal) * 100)
                    : 0;
            }

            $chartPriorityWeekly->push($row);
        }

        $totalRow = [
            'week' => 'Total',
        ];

        $grandTotal = array_sum($totals);

        foreach ($prioritySeries as $series) {

            $key = $series['key'];

            $totalRow[$key] = $totals[$key];

            $totalRow[$key . '_percent'] = $grandTotal > 0
                ? round(($totals[$key] / $grandTotal) * 100)
                : 0;
        }

        $chartPriorityWeekly->push($totalRow);

        return [
            'chart' => $chartPriorityWeekly,
            'series' => $prioritySeries,
        ];
    }

    public static function getInspectorWeekly(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate)
    {
        $inspectorFindings = Finding::query()
            ->join('users', 'findings.inspected_by', '=', 'users.id')
            ->selectRaw("
        users.name as inspector,
        CASE
            WHEN DAY(findings.created_at) BETWEEN 1 AND 7 THEN 1
            WHEN DAY(findings.created_at) BETWEEN 8 AND 14 THEN 2
            WHEN DAY(findings.created_at) BETWEEN 15 AND 21 THEN 3
            WHEN DAY(findings.created_at) BETWEEN 22 AND 28 THEN 4
            ELSE 5
        END as week_number,
        COUNT(*) as total
    ")
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'users.id',
                'users.name',
                'week_number'
            )
            ->get();

        $chartInspectorFindings = $inspectorFindings
            ->groupBy('week_number')
            ->flatMap(function ($items, $week) {

                return $items
                    ->sortByDesc('total')
                    ->take(3)
                    ->values()
                    ->map(function ($item) use ($week) {

                        return [
                            'label' => $item->inspector,
                            'week' => "W-{$week}",
                            'week_number' => (int) $week,
                            'value' => (int) $item->total,

                            'fill' => match ((int) $week) {
                                1 => 'var(--chart-1)',
                                2 => 'var(--chart-2)',
                                3 => 'var(--chart-3)',
                                4 => 'var(--chart-4)',
                                default => 'var(--chart-5)',
                            },
                        ];
                    });
            })
            ->values();

        return [
            'chart' => $chartInspectorFindings,
        ];
    }

    public static function getDepartmentClosingRate(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        return Department::query()
            ->leftJoin('findings', 'departments.id', '=', 'findings.department_id')
            ->leftJoin(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->select(
                'departments.id',
                'departments.code',
                'departments.name',
            )
            ->selectRaw("
            COUNT(findings.id) AS total_findings,

            SUM(
                CASE
                    WHEN finding_statuses.name = 'Closed'
                    THEN 1
                    ELSE 0
                END
            ) AS closed_findings
        ")
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'departments.id',
                'departments.code',
                'departments.name'
            )
            ->havingRaw('COUNT(findings.id) > 0')
            ->get()
            ->map(function ($dept) {

                $total = (int) $dept->total_findings;
                $closed = (int) $dept->closed_findings;

                return [
                    'code' => $dept->code,
                    'name' => $dept->name,
                    'totalFindings' => $total,
                    'closedFindings' => $closed,
                    'closingRate' => $total > 0
                        ? round(($closed / $total) * 100, 1)
                        : 0,
                ];
            })
            ->sortByDesc('closingRate')
            ->values();
    }

    public static function getWorkCenterClosingRate(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        return WorkCenter::query()
            ->leftJoin(
                'findings',
                'work_centers.id',
                '=',
                'findings.work_center_id'
            )
            ->leftJoin(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->select(
                'work_centers.id',
                'work_centers.code',
                'work_centers.name'
            )
            ->selectRaw("
            COUNT(findings.id) AS total_findings,

            SUM(
                CASE
                    WHEN finding_statuses.name = 'Closed'
                    THEN 1
                    ELSE 0
                END
            ) AS closed_findings
        ")
            ->whereBetween(
                'findings.created_at',
                [$startDate, $endDate]
            )
            ->groupBy(
                'work_centers.id',
                'work_centers.code',
                'work_centers.name'
            )
            ->havingRaw('COUNT(findings.id) > 0')
            ->get()
            ->map(function ($item) {

                $total = (int) $item->total_findings;
                $closed = (int) $item->closed_findings;

                return [
                    'code' => $item->code,
                    'name' => $item->name,
                    'totalFindings' => $total,
                    'closedFindings' => $closed,
                    'closingRate' => $total > 0
                        ? round(($closed / $total) * 100, 1)
                        : 0,
                ];
            })
            ->sortByDesc('closingRate')
            ->values();
    }

    public static function getTopFindingClauses(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        $totalFindings = static::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return static::query()
            ->join(
                'finding_clauses',
                'findings.finding_clause_id',
                '=',
                'finding_clauses.id'
            )
            ->leftJoin(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->select(
                'finding_clauses.id',
                'finding_clauses.code',
                'finding_clauses.description'
            )
            ->selectRaw('
            COUNT(findings.id) AS total
        ')
            ->selectRaw("
            SUM(
                CASE
                    WHEN finding_statuses.name = 'Closed'
                    THEN 1
                    ELSE 0
                END
            ) AS closed
        ")
            ->whereBetween(
                'findings.created_at',
                [$startDate, $endDate]
            )
            ->groupBy(
                'finding_clauses.id',
                'finding_clauses.code',
                'finding_clauses.description'
            )
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($totalFindings) {

                $total = (int) $item->total;
                $closed = (int) $item->closed;

                return [
                    'label' => $item->code,

                    'name' => $item->description,

                    'value' => $total,

                    'closedFindings' => $closed,

                    'closingRate' => $total > 0
                        ? round(($closed / $total) * 100, 1)
                        : 0,

                    'percentage' => $totalFindings > 0
                        ? round(($total / $totalFindings) * 100, 1)
                        : 0,
                ];
            });
    }

    public static function getTopFindingCauses(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        $totalFindings = static::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return static::query()
            ->join(
                'cause_codes',
                'findings.cause_code_id',
                '=',
                'cause_codes.id'
            )
            ->leftJoin(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->select(
                'cause_codes.id',
                'cause_codes.code',
                'cause_codes.description'
            )
            ->selectRaw('
            COUNT(findings.id) AS total
        ')
            ->selectRaw("
            SUM(
                CASE
                    WHEN finding_statuses.name = 'Closed'
                    THEN 1
                    ELSE 0
                END
            ) AS closed
        ")
            ->whereBetween(
                'findings.created_at',
                [$startDate, $endDate]
            )
            ->groupBy(
                'cause_codes.id',
                'cause_codes.code',
                'cause_codes.description'
            )
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($totalFindings) {

                $total = (int) $item->total;
                $closed = (int) $item->closed;

                return [
                    'label' => $item->code,

                    'name' => $item->description,

                    'value' => $total,

                    'closedFindings' => $closed,

                    'closingRate' => $total > 0
                        ? round(($closed / $total) * 100, 1)
                        : 0,

                    'percentage' => $totalFindings > 0
                        ? round(($total / $totalFindings) * 100, 1)
                        : 0,
                ];
            });
    }

    public static function getTopSubPlants(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        return static::query()
            ->join(
                'functional_locations',
                'findings.functional_location_id',
                '=',
                'functional_locations.id'
            )
            ->selectRaw("
            SUBSTRING_INDEX(
                SUBSTRING_INDEX(functional_locations.code, '-', 3),
                '-',
                -1
            ) AS plant
        ")
            ->selectRaw("
            COUNT(findings.id) AS total
        ")
            ->whereBetween(
                'findings.created_at',
                [$startDate, $endDate]
            )
            ->groupBy(DB::raw("
            SUBSTRING_INDEX(
                SUBSTRING_INDEX(functional_locations.code, '-', 3),
                '-',
                -1
            )
        "))
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn($item) => [
                'label' => $item->plant,
                'name'  => $item->plant,
                'value' => (int) $item->total,
            ]);
    }

    public static function getTopMainPlants(
        \Carbon\Carbon $startDate,
        \Carbon\Carbon $endDate
    ) {
        $totalFindings = static::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return static::query()
            ->join(
                'functional_locations',
                'findings.functional_location_id',
                '=',
                'functional_locations.id'
            )
            ->leftJoin(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->selectRaw("
            SUBSTRING_INDEX(functional_locations.code, '-', 2) AS plant
        ")
            ->selectRaw("
            COUNT(findings.id) AS total
        ")
            ->selectRaw("
            SUM(
                CASE
                    WHEN finding_statuses.name = 'Closed'
                    THEN 1
                    ELSE 0
                END
            ) AS closed
        ")
            ->whereBetween(
                'findings.created_at',
                [$startDate, $endDate]
            )
            ->groupBy(DB::raw("
            SUBSTRING_INDEX(functional_locations.code, '-', 2)
        "))
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) use ($totalFindings) {

                $total = (int) $item->total;
                $closed = (int) $item->closed;

                return [
                    'label' => $item->plant,
                    'name' => $item->plant,
                    'value' => $total,
                    'closedFindings' => $closed,
                    'closingRate' => $total > 0
                        ? round(($closed / $total) * 100, 1)
                        : 0,
                    'percentage' => $totalFindings > 0
                        ? round(($total / $totalFindings) * 100, 1)
                        : 0,
                ];
            });
    }

    public static function getPlantProgress()
    {
        $totalFindings = static::count();

        return static::query()
            ->join(
                'functional_locations',
                'findings.functional_location_id',
                '=',
                'functional_locations.id'
            )
            ->join(
                'plants',
                'functional_locations.plant_id',
                '=',
                'plants.id'
            )
            ->leftJoin(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->select(
                'plants.id',
                'plants.code',
                'plants.name',
                'plants.sort_order'
            )
            ->selectRaw('COUNT(findings.id) AS total')
            ->selectRaw("
            SUM(
                CASE
                    WHEN finding_statuses.name = 'Closed'
                    THEN 1
                    ELSE 0
                END
            ) AS closed
        ")
            ->groupBy(
                'plants.id',
                'plants.code',
                'plants.name',
                'plants.sort_order'
            )
            ->orderBy('plants.sort_order')
            ->get()
            ->map(function ($item) use ($totalFindings) {

                $total = (int) $item->total;
                $closed = (int) $item->closed;

                return [
                    'plant' => [
                        'id' => $item->id,
                        'code' => $item->code,
                        'name' => $item->name,
                    ],

                    'closedFindings' => $closed,

                    'totalPlantFindings' => $total,

                    'closingRate' => $total > 0
                        ? round(($closed / $total) * 100, 1)
                        : 0,

                    'totalFindings' => $totalFindings,
                ];
            });
    }
}
