<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Models\Role;
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
        'departments',
        'position_id',
        'work_center_id',
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
        ];
    }

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = $request->query('query');
        $departmentCode = $request->query('department');
        $positionCode = $request->query('position');
        $roleName = $request->query('role');
        $withTrashed = $request->boolean('withTrashed');

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->orWhere('name', 'LIKE', "%{$search}%")
                    ->orWhere('employee_id', 'LIKE', "%{$search}%")
                    ->orWhere('phone_number', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if ($departmentCode) {
            $builder->whereRelation('department', 'code', $departmentCode);
        }

        if ($positionCode) {
            $builder->whereRelation('position', 'code', $positionCode);
        }

        if ($roleName) {
            $roleExists = Role::where('name', $roleName)->where('guard_name', 'web')->exists();

            if ($roleExists) {
                $builder->role($roleName);
            }
        }

        if ($withTrashed) {
            $builder->withTrashed();
        }
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }


    public function is_online(): bool
    {
        return $this->last_activity && Carbon::parse($this->last_activity)->gt(Carbon::now()->subMinute(5));
    }
}
