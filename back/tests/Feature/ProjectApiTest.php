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
    public function test_can_create_project(): void
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
