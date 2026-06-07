<?php

namespace App\Models;

use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'name',
        'email',
        'phone_number',
        'password',
        'avatar',
        'department_id',
        'position_id',
        'work_center_id',
        'last_activity'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'password' => 'hashed',
            'last_activity' => 'datetime',
        ];
    }

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $department = $request->query('department');
        $position = $request->query('position');
        $workCenterCode = $request->query('work-center');
        $role = $request->query('role');
        $withTrashed = $request->boolean('withTrashed');

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('employee_id', 'LIKE', "%{$search}%")
                    ->orWhere('phone_number', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if ($department && is_array($department)) {
            $builder->whereHas('department', function ($query) use ($department) {
                $query->whereIn('code', $department);
            });
        } elseif ($department && is_string($department)) {
            $builder->whereRelation('department', 'code', $department);
        }

        if ($position && is_array($position)) {
            $builder->whereHas('position', function ($query) use ($position) {
                $query->whereIn('code', $position);
            });
        } elseif ($position && is_string($position)) {
            $builder->whereRelation('position', 'code', $position);
        }

        if ($workCenterCode) {
            $builder->whereRelation('workCenter', 'code', $workCenterCode);
        }

        if ($role && is_array($role)) {
            $builder->role($role);
        }

        if ($withTrashed) {
            $builder->withTrashed();
        }
    }

    #[Scope]
    public function scopeWithDefaultRelations($query)
    {
        return $query->with([
            'department',
            'position',
            'workCenter',
        ]);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function workCenter(): BelongsTo
    {
        return $this->belongsTo(WorkCenter::class);
    }

    public function isOnline(): bool
    {
        return $this->last_activity && $this->last_activity->gt(now()->subMinutes(5));
    }

    public function installDismantleHistories(): HasMany
    {
        return $this->hasMany(InstallDismantleHistory::class);
    }

    public function repositories(): HasMany
    {
        return $this->hasMany(Repository::class);
    }

    public function inspectedFindings(): HasMany
    {
        return $this->hasMany(Finding::class, 'inspected_by', 'id');
    }

    public function rectifiedFindings(): HasMany
    {
        return $this->hasMany(Finding::class, 'rectified_by', 'id');
    }

    public function verifiedFindings(): HasMany
    {
        return $this->hasMany(Finding::class, 'verified_by', 'id');
    }
}
