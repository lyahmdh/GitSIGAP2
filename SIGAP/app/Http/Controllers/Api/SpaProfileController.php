<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SpaProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $reports = $user->reports()
            ->with('category:id,name')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'reports' => $reports,
            'summary' => [
                'total' => $reports->count(),
                'masuk' => $reports->where('status', 'masuk')->count(),
                'diverifikasi' => $reports->where('status', 'diverifikasi')->count(),
                'ditindaklanjuti' => $reports->where('status', 'ditindaklanjuti')->count(),
                'selesai' => $reports->where('status', 'selesai')->count(),
                'ditolak' => $reports->where('status', 'ditolak')->count(),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $user->profile_photo = $request->file('photo')->store('profiles', 'public');
        }

        $user->name = $validated['name'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'user' => $this->userPayload($user),
        ]);
    }

    public function destroyPhoto(Request $request)
    {
        $user = $request->user();
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
            $user->profile_photo = null;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Foto profil berhasil dihapus.',
            'user' => $this->userPayload($user),
        ]);
    }

    private function userPayload($user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'profile_photo' => $user->profile_photo
                ? '/storage/' . ltrim($user->profile_photo, '/')
                : null,
        ];
    }
}
