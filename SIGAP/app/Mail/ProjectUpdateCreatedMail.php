<?php

namespace App\Mail;

use App\Models\ProjectUpdate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProjectUpdateCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public ProjectUpdate $projectUpdate;

    public function __construct(ProjectUpdate $projectUpdate)
    {
        $this->projectUpdate = $projectUpdate;
    }

    public function build()
    {
        return $this->subject('Pembaruan Progres Laporan')
            ->view('emails.project-update-created');
    }
}
