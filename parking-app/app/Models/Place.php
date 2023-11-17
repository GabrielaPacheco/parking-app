<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;
    protected $fillable = ['nombre', 'disponibilidad', 'sector_id', 'user_id', 'tiempo_inicio', 'tiempo_final', 'precio_total'];

    protected $casts = [
        'tiempo_inicio' => 'datetime',
        'tiempo_final' => 'datetime'
    ];
    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }
    //Para que un usuario ocupe un espacio en el parqueo
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    //Para que inicio la hora necesita obtener las fecha y hora que inicia el proceso de parking
    public function getStartTimeAttribute($value)
    {
        return Carbon::parse($value)->format('Y-m-d h:i:s');
    }
}
