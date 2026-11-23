<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SpaAuthController extends Controller
{
    /**
     * Register a user and establish a first-party web session.
     */
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'user',
        ]);

        // Kirim email verifikasi.
        $user->sendEmailVerificationNotification();

        // Login otomatis menggunakan session Laravel.
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Silakan periksa email untuk verifikasi akun.',
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'email_verified_at',
            ]),
        ], 201);
    }

    /**
     * Authenticate using Laravel's session guard.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::guard('web')->attempt(
            $credentials,
            $request->boolean('remember')
        )) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $request->session()->regenerate();

        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'email_verified_at',
            ]),
        ]);
    }

    /**
     * Return the currently authenticated SPA user.
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'email_verified_at',
            ]),
        ]);
    }

    /**
     * Resend email verification notification.
     */
    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'verified' => true,
                'message' => 'Email kamu sudah terverifikasi.',
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'verified' => false,
            'message' => 'Email verifikasi berhasil dikirim ulang.',
        ]);
    }

    /**
     * Invalidate the current session.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }
}