<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

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

    public function activeUsers()
    {
        return $this->users()->whereNull('user_projects.leave_at');
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return Carbon::instance($date)
            ->timezone('Asia/Tokyo')
            ->toDateTimeString(); // 例: 'Y-m-d H:i:s' 形式
    }
}
