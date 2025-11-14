<?php

namespace Database\Seeders;

use App\Models\User;
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

        // Mengambil semua permission
        $adminRole->givePermissionTo(Permission::all());

        // Cari user admin dan assign role jika ditemukan
        $admin = User::where('email', 'admin@gmail.com')->first();
        $admin->assignRole($adminRole);
    }
}
