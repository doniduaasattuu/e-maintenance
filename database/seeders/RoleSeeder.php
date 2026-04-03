<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
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
        User::create([
            'name' => 'Admin',
            'employee_id' => '10011001',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);

        $adminRole = Role::firstOrcreate([
            'name' => 'Admin',
        ]);

        $viewerRole = Role::firstOrcreate([
            'name' => 'Viewer',
        ]);

        // Mengambil semua permission
        $adminRole->givePermissionTo(Permission::all());
        $viewerRole->givePermissionTo([
            'index_department',
            'index_division',
            'index_workcenter',
            'index_functionallocation',
            'index_equipment',
            'index_material',
            'index_equipmentclass',
            'index_equipmentstatus',
            'index_repository',
            'index_materialunit',
            'index_materialtype',
            'index_findingclause',
            'index_findingstatus',
            'index_findingpriority',
            'index_finding',
            'index_audit',
            'index_abnormality',
            'resolve_finding',
        ]);

        // Cari user admin dan assign role jika ditemukan
        $admin = User::where('email', 'admin@gmail.com')->first();
        $admin->assignRole($adminRole);
    }
}
