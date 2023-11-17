<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Sector;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sectors', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->integer('precio_hora');
            $table->timestamps();
        });

        Sector::create([
            'nombre'=> 'Top sector',
            'precio_hora'=> 10,
        ]);
        Sector::create([
            'nombre'=> 'Right sector',
            'precio_hora'=> 20,
        ]);
        Sector::create([
            'nombre'=> 'Left sector',
            'precio_hora'=> 30,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sectors');
    }
};
