<?php

namespace App\Http\Controllers;

use App\Http\Resources\SectorResource;
use App\Models\Sector;
use Illuminate\Http\Request;

class SectorController extends Controller
{
    public function index(){
        return SectorResource::collection(Sector::all());
    }
}
