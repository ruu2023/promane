DB Schema

projects

- id
- name
- description (プロジェクト説明)
- start_at
- end_at
- created_at
- updated_at

tasks

- id
- project_id (外部キー)
- name
- description (タスク詳細)
- status (未着手/進行中/完了など)
- is_today (今日やることフラグ)
- priority (優先度: 低/中/高)
- start_at
- end_at
- created_by (作成者 ID)
- assigned_to (担当者 ID、NULLable)
- created_at
- updated_at

user_projects

- id
- user_id (外部キー)
- project_id (外部キー)
- role (owner/member/viewer など)
- join_at
- leave_at (NULLable)
- created_at
- updated_at

comments (タスクへのコメント)

- id
- task_id (外部キー)
- user_id (外部キー)
- content
- created_at
- updated_at

task_labels (タスクのラベル/タグ)

- id
- name
- color
- project_id (プロジェクト固有のラベル)
- created_at
- updated_at

task_label_pivot (多対多関連)

- task_id
- label_id

users (Laravel のデフォルトに追加)

- id
- name
- email
- password
- created_at
- updated_at

```php
// create_projects_table.php
Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->timestamp('start_at')->nullable();
    $table->timestamp('end_at')->nullable();
    $table->timestamps();
});

// create_tasks_table.php
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->constrained()->onDelete('cascade');
    $table->string('name');
    $table->text('description')->nullable();
    $table->enum('status', ['backlog', 'in_progress', 'review', 'done'])->default('backlog');
    $table->boolean('is_today')->default(false);
    $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
    $table->timestamp('start_at')->nullable();
    $table->timestamp('end_at')->nullable();
    $table->foreignId('created_by')->constrained('users');
    $table->foreignId('assigned_to')->nullable()->constrained('users');
    $table->timestamps();
});

// create_user_projects_table.php
Schema::create('user_projects', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('project_id')->constrained()->onDelete('cascade');
    $table->enum('role', ['owner', 'member', 'viewer'])->default('member');
    $table->timestamp('join_at')->useCurrent();
    $table->timestamp('leave_at')->nullable();
    $table->timestamps();

    // ユーザーは同じプロジェクトに複数回参加できないようにする
    $table->unique(['user_id', 'project_id', 'leave_at']);
});

// database/migrations/xxxx_xx_xx_xxxxxx_create_comments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->timestamps();

            // よく使う検索用
            $table->index(['task_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};

// database/migrations/xxxx_xx_xx_xxxxxx_create_task_labels_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('task_labels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('color', 20)->default('#999999');
            $table->timestamps();

            // 同一プロジェクト内で同名ラベルを禁止
            $table->unique(['project_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_labels');
    }
};


// database/migrations/xxxx_xx_xx_xxxxxx_create_task_label_pivot_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('task_label_pivot', function (Blueprint $table) {
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('label_id')->constrained(table: 'task_labels')->onDelete('cascade');

            // 同一タスクに同じラベルを重複付与しない
            $table->primary(['task_id', 'label_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_label_pivot');
    }
};
```

### model

- model 作成コマンド

```
php artisan make:model Project
php artisan make:model Task
php artisan make:model UserProject
php artisan make:model Comment
php artisan make:model TaskLabel
```

```php
// Project.php
public function tasks()
{
    return $this->hasMany(Task::class);
}

public function users()
{
    return $this->belongsToMany(User::class, 'user_projects')
                ->withPivot('role', 'join_at', 'leave_at')
                ->withTimestamps();
}

// Task.php
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

// User.php
public function projects()
{
    return $this->belongsToMany(Project::class, 'user_projects')
                ->withPivot('role', 'join_at', 'leave_at')
                ->withTimestamps();
}

public function createdTasks()
{
    return $this->hasMany(Task::class, 'created_by');
}

public function assignedTasks()
{
    return $this->hasMany(Task::class, 'assigned_to');
}
```
