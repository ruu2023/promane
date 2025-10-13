<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\SerializesDatesToJst;

class Task extends Model
{
    use HasFactory;
    use SerializesDatesToJst;

    protected $fillable = [
        'name',
        'description',
        'status',
        'is_today',
        'priority',
        'start_at',
        'end_at',
        'created_by',
        'assigned_to',
    ];

    protected $casts = [
        'is_today' => 'boolean',
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function labels()
    {
        return $this->belongsToMany(TaskLabel::class, 'task_label_pivot', 'task_id', 'label_id');
    }

    public function scopeToday($query)
    {
        return $query->where('is_today', true);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
