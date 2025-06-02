<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Membuat role Admin
        $this->roleAdminSeeder();
    }

    private function roleAdminSeeder(): void
    {
        $adminRole = Role::create([
            'name' => 'Admin',
        ]);

        // for ($i = 0; $i < 500; $i++) {
        //     Role::firstOrCreate([
        //         'name' => fake()->name('male')
        //     ]);
        // }

        // Mengambil semua permission
        $allPermissions = Permission::pluck('name');
        $adminRole->givePermissionTo($allPermissions);

        // Cari user admin dan assign role jika ditemukan
        $admin = User::where('email', 'admin@gmail.com')->first();

        if ($admin) {
            $admin->assignRole('Admin');
        }
    }
}
