<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\StoreReportRequest;
use App\Models\Category;
use App\Models\Report;
use App\Models\ReportImage;
use App\Models\District;
use App\Mail\ReportStatusUpdatedMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::query()

            // hanya ambil field yang dibutuhkan
            ->select(
                'id',
                'title',
                'category_id',
                'status',
                'district',
                'priority_score',
                'created_at'
            )

            // relasi minimal (images dipakai untuk foto sampul kartu)
            ->with(['category:id,name', 'images:id,report_id,image_path']);

        $user = $request->user();

        // Riwayat laporan hanya dapat diminta oleh pengguna yang sudah login.
        if ($request->boolean('mine')) {
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Silakan login untuk melihat riwayat laporan',
                ], 401);
            }

            $query->where('user_id', $user->id);
        }

        // Laporan ditolak hanya boleh disertakan dalam hasil untuk admin.
        if ($request->boolean('include_rejected') && (!$user || $user->role !== 'admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk melihat laporan ditolak',
            ], 403);
        }

        // Pengguna publik dan non-admin hanya dapat melihat laporan yang tidak ditolak.
        if (!$user || $user->role !== 'admin') {
            $query->where('status', '!=', 'ditolak');
        }

        // SEARCH
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // FILTER
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('district')) {
            $query->where('district', $request->district);
        }

        // SORTING
        switch ($request->sort) {
            case 'priority':
                $query->orderByDesc('priority_score');
                break;

            case 'oldest':
                $query->orderBy('created_at');
                break;

            default:
                $query->latest();
                break;
        }

        // Paginasi opsional: aktif jika client mengirim page / per_page.
        // Tanpa keduanya respons tetap seperti sebelumnya (kompatibel dengan pemanggil lama).
        if ($request->filled('page') || $request->filled('per_page')) {
            $paginator = $query->paginate(
                min(max((int) $request->input('per_page', 12), 1), 50)
            );

            return response()->json([
                'success' => true,
                'data' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ]);
        }

        $reports = $query->get();

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * GET /api/reports/stats/districts
     * Jumlah laporan publik untuk seluruh kecamatan pada tabel districts.
     */
    public function districtStats()
    {
        $stats = District::query()
            ->withCount(['reports as count' => function ($query) {
                $query->where('status', '!=', 'ditolak');
            }])
            ->orderByDesc('count')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /** GET /api/reports/map-points — titik laporan publik untuk heat layer peta. */
    public function mapPoints()
    {
        $points = Report::query()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('status', '!=', 'ditolak')
            ->get(['id', 'title', 'latitude', 'longitude', 'status', 'district', 'created_at']);

        return response()->json(['success' => true, 'data' => $points]);
    }

    public function show(string $id)
    {
        $report = Report::with([
            'user:id,name,profile_photo',
            'category:id,name',
            'images:id,report_id,image_path',
            'comments' => fn ($q) => $q->oldest(),
            'comments.user:id,name,profile_photo',
            'projectUpdates' => fn ($q) => $q->oldest(),
            'projectUpdates.images:id,project_update_id,image_path'
        ])->find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Report tidak ditemukan'
            ], 404);
        }

        // tidak tampil kalau ditolak
        if ($report->status === 'ditolak') {
            return response()->json([
                'success' => false,
                'message' => 'Report tidak ditemukan'
            ], 404);
        }

        // anonim
        if ($report->is_anonymous && $report->user) {
            $report->user->name = 'Anonim';
        }

        // format alamat
        $report->formatted_address =
            "Kelurahan {$report->subdistrict}, Kecamatan {$report->district}";

        return response()->json([
            'success' => true,
            'data' => $report
        ]);
    }

    /**
     * GET /api/spa/admin/reports/{id}
     * Detail laporan untuk admin. Berbeda dari show() publik, method ini
     * tetap mengizinkan laporan berstatus ditolak untuk ditinjau admin.
     */
    public function adminShow(string $id)
    {
        $report = Report::with([
            'user:id,name,email,profile_photo',
            'category:id,name',
            'districtRecord:id,name',
            'images:id,report_id,image_path',
            'comments' => fn ($query) => $query->oldest(),
            'comments.user:id,name,profile_photo',
            'projectUpdates' => fn ($query) => $query->oldest(),
            'projectUpdates.images:id,project_update_id,image_path',
        ])->find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan tidak ditemukan',
            ], 404);
        }

        // Hormati pengaturan laporan anonim pada tampilan detail admin.
        if ($report->is_anonymous && $report->user) {
            $report->user->name = 'Anonim';
        }

        $report->formatted_address = collect([
            $report->location_detail,
            $report->districtRecord?->name ?? $report->district,
        ])->filter()->implode(', ');

        return response()->json([
            'success' => true,
            'data' => $report,
        ]);
    }

    public function store(StoreReportRequest $request)
    {
        $validated = $request->validated();

        // duplicate detection (30 meter)
        $duplicate = Report::where('user_id', auth()->id())
            ->where('category_id', $validated['category_id'])
            ->whereRaw("
                ST_Distance_Sphere(
                    POINT(longitude, latitude),
                    POINT(?, ?)
                ) <= ?
            ", [
                $validated['longitude'],
                $validated['latitude'],
                30
            ])
            ->exists();

        if ($duplicate) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melaporkan lokasi ini'
            ], 422);
        }

        $category = Category::find($validated['category_id']);

        // report count berdasarkan radius kategori
        $reportCount = Report::where('category_id', $category->id)
            ->whereRaw("
                ST_Distance_Sphere(
                    POINT(longitude, latitude),
                    POINT(?, ?)
                ) <= ?
            ", [
                $validated['longitude'],
                $validated['latitude'],
                $category->report_radius
            ])
            ->distinct('user_id')
            ->count('user_id');

        // severity score
        $severityScore = match ((int) $validated['severity']) {
            1 => 30,
            2 => 60,
            3 => 100,
        };

        // report count score
        $reportCountScore =
            min($reportCount, 10) * 10;

        // waiting score awal
        $waitingScore = 0;

        // final priority score
        $priorityScore =
            ($severityScore * 0.3) +
            ($reportCountScore * 0.5) +
            ($waitingScore * 0.2);

        DB::beginTransaction();

        try {

            $report = Report::create([
                'user_id' => auth()->id(),
                'category_id' => $validated['category_id'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'severity' => $validated['severity'],
                'is_anonymous' => $validated['is_anonymous'],
                'status' => 'masuk',
                'location_detail' => $validated['location_detail'],
                'district_id' => $validated['district_id'],
                'district' => $validated['district'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'priority_score' => round($priorityScore, 2)
            ]);

            foreach ($validated['images'] as $image) {

                $path = $image->store(
                    'reports',
                    'public'
                );

                ReportImage::create([
                    'report_id' => $report->id,
                    'image_path' => $path
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil dibuat',
                'data' => $report->load([
                    'images',
                    'category'
                ])
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            // Detail teknis hanya dicatat di log server, bukan dikirim ke pengguna.
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat laporan. Silakan coba kembali.',
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        $report = Report::find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Report tidak ditemukan'
            ], 404);
        }

        $user = auth()->user();

        // hanya pemilik laporan
        if ($report->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // hanya jika belum diverifikasi
        if ($report->status !== 'masuk') {
            return response()->json([
                'success' => false,
                'message' => 'Laporan hanya bisa dihapus sebelum diverifikasi'
            ], 422);
        }

        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dihapus'
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        // Route ini juga dilindungi middleware admin, tetapi pemeriksaan ini
        // dipertahankan sebagai lapisan keamanan tambahan.
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:diverifikasi,ditindaklanjuti,selesai,ditolak',
            ],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        // Transisi status mengikuti alur penanganan yang sudah ditetapkan.
        // Status final (selesai/ditolak) tidak dapat diubah kembali.
        $allowedTransitions = [
            'masuk' => ['diverifikasi', 'ditolak'],
            'diverifikasi' => ['ditindaklanjuti', 'ditolak'],
            'ditindaklanjuti' => ['selesai'],
            'selesai' => [],
            'ditolak' => [],
        ];

        // Kunci baris laporan selama proses agar dua permintaan bersamaan
        // tidak dapat melewati pemeriksaan transisi berdasarkan status lama.
        $result = DB::transaction(function () use ($id, $validated, $user, $allowedTransitions) {
            $report = Report::query()
                ->whereKey($id)
                ->lockForUpdate()
                ->first();

            if (!$report) {
                return [
                    'error' => 'Report tidak ditemukan',
                    'http_status' => 404,
                ];
            }

            $previousStatus = (string) $report->status;
            $nextStatus = $validated['status'];
            $possibleNextStatuses = $allowedTransitions[$previousStatus] ?? [];

            if (!in_array($nextStatus, $possibleNextStatuses, true)) {
                return [
                    'error' => "Transisi status dari '{$previousStatus}' ke '{$nextStatus}' tidak valid",
                    'http_status' => 422,
                ];
            }

            $report->status = $nextStatus;
            $report->save();

            // Simpan jejak perubahan status ke tabel yang sudah disediakan
            // oleh migration create_report_status_histories_table.
            DB::table('report_status_histories')->insert([
                'report_id' => $report->id,
                'actor_id' => $user->id,
                'from_status' => $previousStatus,
                'to_status' => $nextStatus,
                'note' => $validated['note'] ?? null,
                'is_system' => false,
                'created_at' => now(),
            ]);

            return [
                'report' => $report->fresh()->load('user'),
                'previous_status' => $previousStatus,
            ];
        });

        if (isset($result['error'])) {
            return response()->json([
                'success' => false,
                'message' => $result['error'],
            ], $result['http_status']);
        }

        $report = $result['report'];

        // Email hanya dikirim setelah transaksi database berhasil.
        // Kegagalan email tidak membatalkan perubahan status yang sudah tersimpan.
        if ($report->user && $report->user->email && $report->user->hasVerifiedEmail()) {
            try {
                Mail::to($report->user->email)
                    ->send(new ReportStatusUpdatedMail($report));
            } catch (\Throwable $e) {
                \Log::error('Email notifikasi perubahan status gagal dikirim', [
                    'report_id' => $report->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diperbarui',
            'data' => $report,
            'previous_status' => $result['previous_status'],
        ]);
    }

}