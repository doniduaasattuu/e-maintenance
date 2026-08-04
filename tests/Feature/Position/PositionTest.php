<?php

use App\Models\Position;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function PHPUnit\Framework\assertCount;
use function PHPUnit\Framework\assertNotNull;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Position', 'User']);
    $this->seed([
        UserSeeder::class,
    ]);
});

test('position has users', function () {
    $position = Position::first();

    $users = User::factory()->count(12)->create([
        'position_id' => $position->id,
    ]);

    assertNotNull($users);
    assertCount(12, $users);
});
