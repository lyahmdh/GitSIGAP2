
<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// URL root dan URL autentikasi lama hanya mengarahkan ke halaman React.
Route::redirect('/', '/react');
Route::redirect('/login', '/react/login')->name('login');
Route::redirect('/register', '/react/register')->name('register');

// Halaman pemberitahuan verifikasi email.
Route::middleware('auth')->group(function () {
    Route::get('/email/verify', function () {
        return redirect('/react/verify-email');
    })->name('verification.notice');
});

// Verifikasi email menggunakan signed URL tanpa mewajibkan session login.
Route::get('/email/verify/{id}/{hash}', function (
    Request $request,
    string $id,
    string $hash
) {
    $user = User::findOrFail($id);

    // Validasi hash email dari URL.
    if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
        abort(403, 'Invalid email verification hash.');
    }

    // Verifikasi email jika belum terverifikasi.
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return redirect('/react/verify-email?verified=1');

})->middleware('signed')->name('verification.verify');

// React SPA shell. Seluruh navigasi aplikasi ditangani React Router,
// sedangkan data dan aksi bisnis menggunakan endpoint di routes/api.php.
Route::view('/react/{path?}', 'react-app')
    ->where('path', '.*')
    ->name('react.app');
