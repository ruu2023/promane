<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_member_can_create_a_task(): void
    {
        // エラー時 500 だけでなく、stack trace を出す
        $this->withoutExceptionHandling();
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $project->users()->attach($user, ['role' => 'member']);

        $taskData = [
            'name' => '新しいテストタスク',
            'description' => 'これはテストタスクです。'
        ];

        // ユーザーを認証ずみ状態にして、API に POST リクエストを送信
        $response = $this->actingAs($user, 'sanctum')
                        ->postJson("/api/projects/{$project->id}/tasks", $taskData);

        // assert
        $response->assertStatus(201);
        $response->assertJsonFragment(['name' => '新しいテストタスク']);

        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'name' => '新しいテストタスク',
            'created_by' => $user->id
        ]);
    }

    public function test_a_non_project_member_cannot_create_a_task(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        // ユーザーの紐づけなし

        $taskData = [
            'name' => '新しいテストタスク（メンバー外の試み）',
            'description' => 'これはテストタスクです。'
        ];

        $response = $this->actingAs($user, 'sanctum')
                        ->postJson("/api/projects/{$project->id}/tasks", $taskData);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('tasks', [
            'name' => '新しいテストタスク（メンバー外の試み）',
            'description' => 'これはテストタスクです。'
        ]);
    }

    public function test_a_project_member_cannot_delete_task_if_not_owner()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $project->users()->attach($user, ['role' => 'member']);

        $task = Task::factory()->create(['project_id' => $project->id, 'created_by' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
                        ->deleteJson("/api/tasks/{$task->id}");

        // assert
        $response->assertStatus(403);

        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }
}
