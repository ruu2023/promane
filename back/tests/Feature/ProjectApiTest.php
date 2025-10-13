<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    // index
    public function test_unauthorized_user_cannot_read_projects()
    {
        $this->getJson("api/projects")->assertStatus(401);
    }

    public function test_a_user_can_only_see_their_own_projects(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $projectForUserA = Project::factory()->create();
        $projectForUserA->users()->attach($userA);

        $projectForUserB = Project::factory()->create();
        $projectForUserB->users()->attach($userB);

        $response = $this->actingAs($userA, 'sanctum')->getJson('/api/projects');

        $response->assertOk();

        $response->assertJsonCount(1, 'data');

        $response->assertJsonFragment([
            'id' => $projectForUserA->id,
            'name' => $projectForUserA->name,
        ]);

        $response->assertJsonMissing([
            'id' => $projectForUserB->id,
            'name' => $projectForUserB->name,
        ]);
    }

    // show
    public function test_a_user_can_only_see_their_own_project_detail()
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $projectForUserA = Project::factory()->create();
        $projectForUserA->users()->attach($userA);

        $projectForUserB = Project::factory()->create();
        $projectForUserB->users()->attach($userB);

        $response = $this->actingAs($userA, 'sanctum')->getJson("/api/projects/{$projectForUserA->id}");

        $response->assertOk();

        $response->assertJsonFragment([
            'id' => $projectForUserA->id,
            'name' => $projectForUserA->name,
        ]);

        $response->assertJsonMissing([
            'id' => $projectForUserB->id,
            'name' => $projectForUserB->name,
        ]);
    }

    public function a_user_cannot_see_another_users_project(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $projectForUserB = Project::factory()->create();
        $projectForUserB->users()->attach($userB);

        $this->actingAs($userA, 'sanctum')
             ->getJson("/api/projects/{$projectForUserB->id}")
             ->assertForbidden();
    }

    public function test_project_creation(): void
    {
        $user = User::factory()->create();

        $projectData = [
            "name" => "テストプロジェクト",
            "description" => "テスト用のプロジェクトです",
            "start_at" => "2025-10-01",
            "end_at" => "2025-11-01"
        ];

        $response = $this->actingAs($user, 'sanctum')
                        ->postJson("/api/projects", $projectData);

        // assert
        $response->assertStatus(201);

        $this->assertDatabaseHas('projects', [
            "name" => "テストプロジェクト",
            "description" => "テスト用のプロジェクトです",
        ]);
    }

    public function test_project_creation_fails_if_name_is_missing()
    {
        $user = User::factory()->create();

        // name を空にする
        $projectData = [
            "name" => "",
            "description" => "名前がありません",
            "start_at" => "2025-10-01",
            "end_at" => "2025-11-01"
        ];

        $response = $this->actingAs($user, 'sanctum')
                        ->postJson("/api/projects", $projectData);

        // assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    public function test_a_project_member_can_update_project()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $project->users()->attach($user, ['role' => 'member']);

        $projectData = [
            "name" => "テストプロジェクトの更新",
            "description" => "テスト用のプロジェクトです",
            "start_at" => "2025-10-01",
            "end_at" => "2025-11-01"
        ];

        $response = $this->actingAs($user, 'sanctum')
                        ->putJson("/api/projects/{$project->id}", $projectData);

        // assert
        $response->assertStatus(200);

        $this->assertDatabaseHas('projects', [
            "name" => "テストプロジェクトの更新",
            "description" => "テスト用のプロジェクトです",
        ]);
    }

    public function test_a_non_project_member_cannot_update_project()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        // $project->users()->attach($user, ['role' => 'member']);

        $projectData = [
            "name" => "テストプロジェクトの更新",
            "description" => "テスト用のプロジェクトです",
            "start_at" => "2025-10-01",
            "end_at" => "2025-11-01"
        ];

        $response = $this->actingAs($user, 'sanctum')
                        ->putJson("/api/projects/{$project->id}", $projectData);

        // assert
        $response->assertStatus(403);

        $this->assertDatabaseMissing('projects', [
            "name" => "テストプロジェクトの更新",
            "description" => "テスト用のプロジェクトです",
        ]);
    }

    public function test_a_project_owner_can_delete_project()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $project->users()->attach($user, ['role' => 'owner']);

        $response = $this->actingAs($user, 'sanctum')
                        ->deleteJson("/api/projects/{$project->id}");

        // assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id
        ]);
    }

    public function test_a_project_member_cannot_delete_project()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $project->users()->attach($user, ['role' => 'member']);

        $response = $this->actingAs($user, 'sanctum')
                        ->deleteJson("/api/projects/{$project->id}");

        // assert
        $response->assertStatus(403);
        $this->assertDatabaseHas('projects', [
            'id' => $project->id
        ]);
    }
}
