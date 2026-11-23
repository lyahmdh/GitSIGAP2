<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectUpdate\StoreProjectUpdateRequest;
use App\Models\ProjectUpdate;
use App\Models\ProjectUpdateImage;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProjectUpdateController extends Controller
{
    /**
     * Mengambil riwayat progres sebuah laporan secara kronologis.
     */
    public function index(string $id): JsonResponse
    {
        $report = Report::query()->findOrFail($id);

        $updates = ProjectUpdate::query()
            ->with([
                'images:id,project_update_id,image_path',
                'admin:id,name',
            ])
            ->where('report_id', $report->id)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $updates,
        ]);
    }

    /**
     * Menambahkan progres laporan beserta maksimal lima foto dokumentasi.
     */
    public function store(StoreProjectUpdateRequest $request, string $id): JsonResponse
    {
        $report = Report::query()->findOrFail($id);
        $validated = $request->validated();
        $storedPaths = [];

        try {
            $update = DB::transaction(function () use ($validated, $request, $report, &$storedPaths) {
                $update = ProjectUpdate::create([
                    'report_id' => $report->id,
                    'admin_id' => $request->user()->id,
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                ]);

                foreach ($validated['images'] ?? [] as $image) {
                    $path = $image->store('project-updates', 'public');

                    if (!$path) {
                        throw new \RuntimeException('Foto dokumentasi gagal disimpan.');
                    }

                    $storedPaths[] = $path;

                    ProjectUpdateImage::create([
                        'project_update_id' => $update->id,
                        'image_path' => $path,
                    ]);
                }

                return $update->load([
                    'images:id,project_update_id,image_path',
                    'admin:id,name',
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Pembaruan progres berhasil disimpan.',
                'data' => $update,
            ], 201);
        } catch (Throwable $exception) {
            if ($storedPaths !== []) {
                Storage::disk('public')->delete($storedPaths);
            }

            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Pembaruan progres gagal disimpan. Silakan coba kembali.',
            ], 500);
        }
    }
}
