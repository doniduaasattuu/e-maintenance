<?php

namespace Tests;

use Database\Seeders\Traits\HasPermissionGenerator;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use HasPermissionGenerator;
}
