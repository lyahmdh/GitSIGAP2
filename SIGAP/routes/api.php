<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProjectUpdateController;
use App\Http\Controllers\Api\SpaAuthController;
use App\Http\Controllers\Api\SpaProfileController;

Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/stats/districts', [ReportController::class, 'districtStats']);
Route::get('/reports/map-points', [ReportController::class, 'mapPoints']);
Route::get('/public/home-stats', function () {
    $total = \App\Models\Report::count();
    $accepted = \App\Models\Report::whereIn('status', [
        'diverifikasi', 'ditindaklanjuti', 'selesai',
    ])->count();

    return response()->json([
        'success' => true,
        'data' => [
            'total' => $total,
            'aktif' => \App\Models\Report::whereIn('status', ['diverifikasi', 'ditindaklanjuti'])->count(),
            'selesai' => \App\Models\Report::where('status', 'selesai')->count(),
            'diterima' => $accepted,
        ],
    ]);
});
Route::get('/reports/{id}', [ReportController::class, 'show']);

// komentar publik (lihat komentar)
Route::get('/reports/{id}/comments', [CommentController::class, 'index']);

// kategori
Route::get('/categories', function () {
    return \App\Models\Category::select('id', 'name')->get();
});


// FIRST-PARTY REACT SPA (Sanctum cookie/session authentication).
// Seluruh endpoint autentikasi dan fitur privat React SPA menggunakan Sanctum.
Route::prefix('spa')->group(function () {
    Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
        Route::post('/register', [SpaAuthController::class, 'register']);
        Route::post('/login', [SpaAuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [SpaAuthController::class, 'me']);
        Route::get('/profile', [SpaProfileController::class, 'show']);
        Route::post('/reports', [ReportController::class, 'store']);
        Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
        Route::put('/profile', [SpaProfileController::class, 'update']);
        Route::delete('/profile/photo', [SpaProfileController::class, 'destroyPhoto']);

        Route::post('/auth/email/verification-notification', [
            SpaAuthController::class,
            'resendVerification',
        ])->middleware('throttle:6,1');

        Route::post('/auth/logout', [SpaAuthController::class, 'logout']);

        // Komentar dari SPA menggunakan sesi Sanctum.
        Route::post('/reports/{id}/comments', [CommentController::class, 'store']);
        Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

        // ADMIN ROUTES UNTUK SPA (Sanctum session authentication).
        Route::prefix('admin')->middleware('admin')->group(function () {
            // Semua laporan, termasuk laporan yang ditolak.
            Route::get('/reports', [ReportController::class, 'index']);

            // Detail laporan khusus admin (termasuk laporan yang ditolak).
            Route::get('/reports/{id}', [ReportController::class, 'adminShow']);

            // Perubahan status laporan.
            Route::patch('/reports/{id}/status', [
                ReportController::class,
                'updateStatus',
            ]);

            // Riwayat dan penambahan progres laporan.
            Route::get('/reports/{id}/updates', [
                ProjectUpdateController::class,
                'index',
            ]);

            Route::post('/reports/{id}/updates', [
                ProjectUpdateController::class,
                'store',
            ]);

            // Statistik admin.
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
    });
});