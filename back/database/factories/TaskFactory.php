<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => $this->faker->realText(10),
            "description" => $this->faker->realText(30),

            "project_id" => Project::factory(),
            "created_by" => User::factory(),
            "assigned_to" => User::factory(),

            "status" => $this->faker->randomElement(['backlog', 'in_progress', 'review', 'done']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
        ];
    }
}
