<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProjectUpdateController;

// PUBLIC ROUTES
Route::prefix('auth')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/{id}', [ReportController::class, 'show']);

// komentar publik (lihat komentar)
Route::get('/reports/{id}/comments', [CommentController::class, 'index']);

// kategori
Route::get('/categories', function () {
    return \App\Models\Category::select('id', 'name')->get();
});

Route::get('/test-image', function () {
    return Storage::disk('public')->url(
        'reports/qC738IEmxvSUIj2DmdIC2eYFNUoD566SmcEY53Lq.jpg'
    );
});

// AUTHENTICATED USER (JWT)
Route::middleware('auth:api')->group(function () {
    // AUTH
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });


    // USER REPORTS
    // buat laporan
    Route::post('/reports', [ReportController::class, 'store']);

    // hapus laporan sendiri
    Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

    // riwayat laporan (clean endpoint, bukan query param)
    Route::get('/reports/my', function (\Illuminate\Http\Request $request) {
        return app(ReportController::class)->index(
            $request->merge(['mine' => true])
        );
    });


    // COMMENTS
    // tambah komentar
    Route::post('/reports/{id}/comments', [CommentController::class, 'store']);

    // hapus komentar sendiri
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
});



// ADMIN ROUTES
Route::prefix('admin')->middleware(['auth:api', 'admin'])->group(function () {

    // REPORT MANAGEMENT
    // semua laporan (admin bisa lihat termasuk ditolak)
    Route::get('/reports', [ReportController::class, 'index']);

    // update status (verify / reject / progress / selesai)
    Route::patch('/reports/{id}/status', [
        ReportController::class,
        'updateStatus'
    ]);

    // PROJECT UPDATES
    // tambah update proyek
    Route::post('/reports/{id}/updates', [
        ProjectUpdateController::class,
        'store'
    ]);

    // list update proyek
    Route::get('/reports/{id}/updates', function ($id) {
        return \App\Models\ProjectUpdate::with('images')
            ->where('report_id', $id)
            ->latest()
            ->get();
    });

    // STATISTICS
    Route::get('/statistics', function () {

        return response()->json([
            'total_reports' => \App\Models\Report::count(),

            'by_status' => \App\Models\Report::selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->get(),

            'by_category' => \App\Models\Report::selectRaw('category_id, COUNT(*) as total')
                ->groupBy('category_id')
                ->get(),

            'by_district' => \App\Models\Report::selectRaw('district, COUNT(*) as total')
                ->groupBy('district')
                ->get(),
        ]);
    });
});
// FIRST-PARTY REACT SPA (Sanctum cookie/session authentication).
// JWT endpoints di atas dipertahankan sementara untuk kompatibilitas selama migrasi.
Route::prefix('spa')->group(function () {
    Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
        Route::post('/register', [\App\Http\Controllers\Api\SpaAuthController::class, 'register']);
        Route::post('/login', [\App\Http\Controllers\Api\SpaAuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [\App\Http\Controllers\Api\SpaAuthController::class, 'me']);
        Route::post('/auth/logout', [\App\Http\Controllers\Api\SpaAuthController::class, 'logout']);
    });
});
