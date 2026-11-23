<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Jalan & Transportasi', 'report_radius' => 75],
            ['name' => 'Air & Drainase', 'report_radius' => 100],
            ['name' => 'Ruang Publik', 'report_radius' => 80],
            ['name' => 'Penerangan Umum', 'report_radius' => 40],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                ['report_radius' => $category['report_radius']]
            );
        }
    }
}
