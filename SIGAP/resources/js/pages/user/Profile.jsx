
import { useState } from 'react';

export default function Profile() {
    const [form, setForm] = useState({
        name: 'Alya Hamidah',
        email: 'alya@example.com',
        phone: '081234567890',
        address: 'Kabupaten Bekasi, Jawa Barat',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Perubahan profil berhasil disimpan (simulasi).');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Profil Saya
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Kelola informasi akun dan data pribadi Anda.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="h-fit rounded-xl border border-gray-200 bg-white p-6 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
                        {form.name.charAt(0)}
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-800">
                        {form.name}
                    </h2>
                    <p className="text-sm text-gray-500">{form.email}</p>
                    <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Pengguna
                    </span>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
                    <h2 className="mb-6 text-lg font-semibold text-gray-800">
                        Informasi Akun
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Nama Lengkap
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5"
                                disabled
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Pengubahan email belum tersedia.
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Nomor Telepon
                            </label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Alamat
                            </label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        {message && (
                            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                        >
                            Simpan Perubahan
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
