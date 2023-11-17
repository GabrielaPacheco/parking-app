<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PlaceResource;

class SectorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request): array
    {
        return [
            "id" => $this->id,
            "nombre" => $this->nombre,
            "precio_hora" => $this->precio_hora,
            "places"=> PlaceResource::collection($this->places),
        ];
    }
}
