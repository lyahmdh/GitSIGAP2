<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistrictSeeder extends Seeder
{
    public function run(): void
    {
        $districts = [
            'Blimbing',
            'Kedungkandang',
            'Klojen',
            'Lowokwaru',
            'Sukun',
        ];

        foreach ($districts as $district) {
            DB::table('districts')->updateOrInsert(
                ['name' => $district],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
