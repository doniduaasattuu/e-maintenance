<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FunctionalLocation extends Model
{
    use HasFactory;

    protected $table = 'functional_locations';

    protected $fillable = [
        'code',
        'description',
        'plant_id',
    ];

    public static function areaExpression(): string
    {
        return DB::getDriverName() === 'sqlite'
            ? 'substr(code,1,5)'
            : 'LEFT(code,5)';
    }

    #[Scope]
    protected function scopeSearch(Builder $builder, Request $request): void
    {
        $search = trim($request->query('query'));

        if ($search) {
            $builder->where(function ($query) use ($search) {
                $query
                    ->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhereRelation('equipments', function (Builder $q) use ($search) {
                        $q
                            ->where('code', 'LIKE', "%{$search}%")
                            ->orWhere('sort_field', 'LIKE', "%{$search}%")
                            ->orWhere('description', 'LIKE', "%{$search}%");
                    });
            });
        }
    }

    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    public function findings(): HasMany
    {
        return $this->hasMany(Finding::class, 'functional_location_id', 'id');
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function plant(): BelongsTo
    {
        return $this->belongsTo(Plant::class);
    }

    public function improvements(): HasMany
    {
        return $this->hasMany(Improvement::class, 'functional_location_id', 'id');
    }
}
