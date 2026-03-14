<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Request;

class Repository extends Model
{
    /** @use HasFactory<\Database\Factories\RepositoryFactory> */
    use HasFactory;

    protected $table = 'repositories';

    protected $fillable =
    [
        'title',
        'path',
        'extension',
        'mime_type',
        'uploaded_by',
    ];

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));
        $ext = $request->query('ext');

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('title', 'LIKE', "%{$search}%");
            })
                ->orWhereRelation('uploadedBy', function (Builder $q) use ($search) {
                    $q
                        ->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('employee_id', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone_number', 'LIKE', "%{$search}%");
                });
        }

        if ($ext && is_array($ext)) {
            $builder->whereIn('extension', $ext);
        } elseif ($ext) {
            $builder->where('extension', $ext);
        }
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function equipments(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class);
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class);
    }
}
