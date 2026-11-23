<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $name = config('admin.name');
        $email = config('admin.email');
        $password = config('admin.password');

        if (! $name || ! $email || ! $password) {
            $this->command?->warn(
                'AdminUserSeeder skipped: set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD to create an admin.'
            );

            return;
        }

        if (strlen($password) < 12) {
            throw new RuntimeException('ADMIN_PASSWORD must be at least 12 characters long.');
        }

        User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]
        );
    }
}
