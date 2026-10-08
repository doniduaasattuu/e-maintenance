<?php

namespace App\Traits;

use Carbon\CarbonInterface;
use DateTimeInterface;

trait HasMonthName
{
    /**
     * Get month name from a date.
     */
    public function getMonthName(
        CarbonInterface|DateTimeInterface|string|null $date
    ): ?string {
        if ($date === null) {
            return null;
        }

        $month = $date instanceof DateTimeInterface
            ? (int) $date->format('n')
            : (int) date('n', strtotime($date));

        return config("app.months.{$month}");
    }
}
