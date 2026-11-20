<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comment\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Report;

class CommentController extends Controller
{
    public function index($id)
    {
        $comments = Comment::with('user:id,name,profile_photo')
            ->where('report_id', $id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    public function store(StoreCommentRequest $request, string $id)
    {
        $report = Report::find($id);

        if (!$report || $report->status === 'ditolak') {
            return response()->json([
                'success' => false,
                'message' => 'Report tidak ditemukan'
            ], 404);
        }

        $validated = $request->validated();

        $comment = Comment::create([
            'report_id' => $report->id,
            'user_id' => auth()->id(),
            'comment' => $validated['comment']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Komentar berhasil ditambahkan',
            'data' => $comment->load('user:id,name,profile_photo')
        ], 201);
    }

    public function destroy(string $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Komentar tidak ditemukan'
            ], 404);
        }

        if ($comment->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Komentar berhasil dihapus'
        ]);
    }
}