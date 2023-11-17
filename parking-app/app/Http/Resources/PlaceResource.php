<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PlaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request):array
    {
       //return parent::toArray($request);
      return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'disponibilidad' => $this->disponibilidad,
            'sector_id' => $this->sector_id,
            'user_id' => $this->user_id,
            'tiempo_inicio' => Carbon::parse($this->tiempo_inicio)->format('Y-m-d h:i:s'),
            'tiempo_final' => $this->tiempo_final,
            'precio_total' => $this->precio_total,
        ];
    }
}
