<?php

namespace App\Http\Requests\ProjectUpdate;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null
            && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => [
                'file',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul progres wajib diisi.',
            'title.max' => 'Judul progres maksimal 150 karakter.',
            'description.required' => 'Deskripsi progres wajib diisi.',
            'images.array' => 'Format foto dokumentasi tidak valid.',
            'images.max' => 'Foto dokumentasi maksimal 5 file.',
            'images.*.image' => 'Setiap dokumentasi harus berupa gambar.',
            'images.*.mimes' => 'Format foto harus JPG, JPEG, atau PNG.',
            'images.*.max' => 'Ukuran setiap foto maksimal 2 MB.',
        ];
    }
}
