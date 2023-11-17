<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Place;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->boolean('disponibilidad')->default(1);
            $table->foreignId('sector_id')->nullable()->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->dateTime('tiempo_inicio')->nullable();
            $table->dateTime('tiempo_final')->nullable();
            $table->integer('precio_total')->nullable();
            $table->timestamps();
        });

        for ($i = 1; $i <= 20; $i++) {
            Place::create([
                'nombre' => 'place ' . $i,
                'sector_id' => rand(1, 3),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('places');
    }
};
