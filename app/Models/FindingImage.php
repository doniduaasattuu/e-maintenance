<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class FindingImage extends Model
{
    protected $table = 'finding_images';

    protected $fillable = [
        'finding_id',
        'file_path',
        'category',
        'original_name',
    ];

    public function finding(): BelongsTo
    {
        return $this->belongsTo(Finding::class);
    }

    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->file_path ? Storage::url($this->file_path) : null,
        );
    }

    protected $appends = ['url'];
}
