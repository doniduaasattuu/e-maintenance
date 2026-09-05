<?php

namespace App\Traits;

trait HasStandardDateResource
{
    protected function formatDate($date): ?string
    {
        return $date?->format('Y-m-d H:i:s');
    }
}
