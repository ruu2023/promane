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

    public function test_unauthorized_user_cannot_read_tasks()
    {
        $task = Task::factory()->create();

        $this->getJson("api/projects/{$task->project_id}/tasks")->assertStatus(401);
    }

    public function test_a_user_can_only_see_their_own_projects_task(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $projectForUserA = Project::factory()->create();
        $projectForUserA->users()->attach($userA);
        $taskForUserA = Task::factory()->create(["project_id" => $projectForUserA->id, "created_by" => $userA->id]);

        $projectForUserB = Project::factory()->create();
        $projectForUserB->users()->attach($userB);
        $taskForUserB = Task::factory()->create(["project_id" => $projectForUserB->id, "created_by" => $userB->id]);

        $response = $this->actingAs($userA, 'sanctum')->getJson("/api/projects/{$projectForUserA->id}/tasks");

        $response->assertOk();

        $response->assertJsonCount(1, 'data');

        $response->assertJsonFragment([
            'id' => $taskForUserA->id,
            'name' => $taskForUserA->name,
        ]);

        $response->assertJsonMissing([
            'id' => $taskForUserB->id,
            'name' => $taskForUserB->name,
        ]);
    }

    public function a_user_cannot_see_tasks_in_another_users_project(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $projectForUserB = Project::factory()->create();
        $projectForUserB->users()->attach($userB);
        Task::factory()->create(['project_id' => $projectForUserB->id]);

        $this->actingAs($userA, 'sanctum')
             ->getJson("/api/projects/{$projectForUserB->id}/tasks")
             ->assertForbidden();
    }

    public function test_a_user_can_only_see_their_own_projects_task_detail(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $projectForUserA = Project::factory()->create();
        $projectForUserA->users()->attach($userA);
        $taskForUserA = Task::factory()->create(["project_id" => $projectForUserA->id, "created_by" => $userA->id]);

        $projectForUserB = Project::factory()->create();
        $projectForUserB->users()->attach($userB);
        $taskForUserB = Task::factory()->create(["project_id" => $projectForUserB->id, "created_by" => $userB->id]);

        $response = $this->actingAs($userA, 'sanctum')->getJson("/api/tasks/{$taskForUserA->id}");

        $response->assertOk();

        $response->assertJsonFragment([
            'id' => $taskForUserA->id,
            'name' => $taskForUserA->name,
        ]);
    }

    public function a_user_cannot_see_detail_of_task_in_another_users_project(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $projectForUserB = Project::factory()->create();
        $projectForUserB->users()->attach($userB);
        $taskForUserB = Task::factory()->create(['project_id' => $projectForUserB->id]);

        $this->actingAs($userA, 'sanctum')
             ->getJson("/api/tasks/{$taskForUserB->id}")
             ->assertForbidden();
    }

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

    public function test_a_project_member_can_update_a_task(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $project->users()->attach($user, ['role' => 'member']);

        $task = Task::factory()->create(['project_id' => $project->id, 'created_by' => $user->id]);

        $taskData = [
            'name' => 'テストタスクの更新',
            'description' => 'これはテストタスクです。'
        ];

        $response = $this->actingAs($user, 'sanctum')
                        ->putJson("/api/tasks/{$task->id}", $taskData);

        // assert
        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', [
            'name' => 'テストタスクの更新',
            'description' => 'これはテストタスクです。'
        ]);
    }

    public function test_a_non_project_member_cannot_update_a_task(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        // $project->users()->attach($user, ['role' => 'member']);

        $task = Task::factory()->create(['project_id' => $project->id, 'created_by' => $user->id]);

        $taskData = [
            'name' => 'テストタスクの更新',
            'description' => 'これはテストタスクです。'
        ];

        $response = $this->actingAs($user, 'sanctum')
                        ->putJson("/api/tasks/{$task->id}", $taskData);

        // assert
        $response->assertStatus(403);

        $this->assertDatabaseMissing('tasks', [
            'name' => 'テストタスクの更新',
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
