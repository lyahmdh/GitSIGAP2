<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

// URL root dan URL autentikasi lama hanya mengarahkan ke halaman React.
Route::redirect('/', '/react');
Route::redirect('/login', '/react/login')->name('login');
Route::redirect('/register', '/react/register')->name('register');

// Link verifikasi email Laravel tetap diproses melalui signed web route,
// kemudian pengguna dikembalikan ke halaman verifikasi React.
Route::middleware('auth')->group(function () {
    Route::get('/email/verify', function () {
        return redirect('/react/verify-email');
    })->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        return redirect('/react/verify-email?verified=1');
    })->middleware('signed')->name('verification.verify');
});

// React SPA shell. Seluruh navigasi aplikasi ditangani React Router,
// sedangkan data dan aksi bisnis menggunakan endpoint di routes/api.php.
Route::view('/react/{path?}', 'react-app')
    ->where('path', '.*')
    ->name('react.app');
