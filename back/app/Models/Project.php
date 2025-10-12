<?php

namespace App\Models;

use App\Traits\SerializesDatesToJst;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    use SerializesDatesToJst;

    protected $fillable = [
        'name',
        'description',
        'start_at',
        'end_at',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];


    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_projects')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function labels()
    {
        return $this->hasMany(TaskLabel::class);
    }

    public function activeUsers()
    {
        return $this->users()->whereNull('user_projects.leave_at');
    }
}
