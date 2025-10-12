<?php

namespace App\Models;

use App\Traits\SerializesDatesToJst;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskLabel extends Model
{
    use HasFactory;
    use SerializesDatesToJst;

    protected $fillable = [
        'name',
        'color',
        'project_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_label_pivot', 'label_id', 'task_id');
    }
}
