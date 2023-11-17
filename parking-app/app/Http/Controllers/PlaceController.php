<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlaceResource;
use App\Models\Place;
use App\Models\Sector;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PlaceController extends Controller
{
    //Comienzo del parking, lugar donde nos parqueamos
    public function startParking(Request $request, Place $place)
    {
        //Una vez empezando el conteo del parking validamos datos que se requieren
        $request->validate([
            "user_id" => ["required", "integer"]
        ]);
        //Validar que el usuario ya esta parqueado
        if ($place->where('user_id', $request->user_id)->whereNull('tiempo_final')->exists()) {
            return response()->json([
                'error' => 'Este carro ya esta parqueado!'
            ]);
        }
        $place->update([
            'user_id' => $request->user_id,
            'tiempo_inicio' => now(),
            'disponibilidad' => 0,
            'tiempo_final' => NULL,
            'precio_total' => NULL,
        ]);    
       //Comentamos esta parte de codigo $place->load('user', 'sector');
        return PlaceResource::make($place);
    }

    public function endParking(Place $place)
    {
        $place->update([
            'disponibilidad' => 1,
            'tiempo_final' => now(),
            'precio_total' => $this->calculatePrice($place->sector_id, $place->tiempo_inicio),
        ]);
        return PlaceResource::make($place);
    }

    public function calculatePrice($sector_id, $tiempo_inicio)
    {
        $inicio = Carbon::createMidnightDate($tiempo_inicio);
        $fin = Carbon::createMidnightDate(now());
        $duracionTotal = $inicio->diffInHours($fin);
        $sector_precio_hora = Sector::find($sector_id)->precio_hora;
        //Parqueo mas de una hora
        if ($duracionTotal >= 1) {
            return ceil($sector_precio_hora * $duracionTotal);
        }

        return $sector_precio_hora;
    }
}
