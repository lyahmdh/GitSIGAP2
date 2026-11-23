<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite tidak menyediakan tipe POINT/spatial index seperti MySQL.
        // Kolom latitude/longitude tetap menjadi sumber koordinat lintas DB.
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        $version = (string) DB::selectOne('SELECT VERSION() AS version')->version;
        $columnDefinition = str_contains(strtolower($version), 'mariadb')
            ? 'POINT NOT NULL'
            : 'POINT NOT NULL SRID 4326';

        DB::statement("ALTER TABLE reports ADD coordinates {$columnDefinition}");
        DB::statement('CREATE SPATIAL INDEX reports_coordinates_spatial_index ON reports (coordinates)');
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('DROP INDEX reports_coordinates_spatial_index ON reports');
        DB::statement('ALTER TABLE reports DROP COLUMN coordinates');
    }
};
