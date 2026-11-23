
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('category_id')
                ->constrained()
                ->restrictOnDelete();
                
            $table->foreignId('district_id')
                ->constrained('districts')
                ->restrictOnDelete();

            $table->string('title', 150);

            $table->text('description');

            // 1 ringan, 2 sedang, 3 berat
            $table->unsignedTinyInteger('severity');

            $table->boolean('is_anonymous')
                ->default(false);

            $table->enum('status', [
                'masuk',
                'diverifikasi',
                'ditindaklanjuti',
                'selesai',
                'ditolak'
            ])->default('masuk');

            // Detail lokasi yang diinput pelapor
            $table->string('location_detail', 255);

            // Kecamatan hasil deteksi koordinat pinpoint peta
            $table->string('district', 100);

            // Koordinat hasil pinpoint pada peta
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);

            // Skor prioritas laporan
            $table->decimal('priority_score', 5, 2)
                ->default(0);

            $table->timestamps();

            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
