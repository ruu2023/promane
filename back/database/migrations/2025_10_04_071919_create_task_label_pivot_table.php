<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_label_pivot', function (Blueprint $table) {
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('label_id')->constrained(table: 'task_labels')->onDelete('cascade');

            // 同一タスクに同じラベルを重複付与しない
            $table->primary(['task_id', 'label_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_label_pivot');
    }
};
