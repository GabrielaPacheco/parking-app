<?php

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    //Esta es la ruta que se usa para log in o saber el 
    //actual usuario logeado y token.

    Route::get('user', function (Request $request) {
        return [
            'user' => $request->user(),
            'currentToken' => $request->bearerToken(),
        ];
    });
    Route::put('user/update/profile', [ProfileController::class, 'updateUserInfo']);
    Route::put('user/update/password', [ProfileController::class, 'updateUserPassword']);
    Route::post('user/logout', [UserController::class, 'logout']);
    Route::get('sectors', [SectorController::class, 'index']);
    Route::put('parking/{place}/start', [PlaceController::class, 'startParking']);
    Route::put('parking/{place}/end', [PlaceController::class, 'endParking']);                                                              
    Route::post('parking/pay',[PaymentController::class,'payByStripe']);
                                                                                                          
});

Route::post('user/register', [UserController::class, 'store']);
Route::post('user/login', [UserController::class, 'auth']);
