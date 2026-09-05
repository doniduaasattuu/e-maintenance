<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ImprovementImage extends Model
{
    protected $table = 'improvement_images';

    protected $fillable = [
        'improvement_id',
        'file_path',
        'category',
        'original_name',
    ];

    public function improvement(): BelongsTo
    {
        return $this->belongsTo(Improvement::class, 'improvement_id');
    }

    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->file_path ? Storage::url($this->file_path) : null,
        );
    }

    protected $appends = ['url'];
}
