<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use ErrorException;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{

    public function payByStripe(Request $request)
    {
        Stripe::setApiKey('sk_test_51ODEd9GXcDLXxyYJA23NgVeEL6O4wgP4VWnjzJPdDoXbJ3dvLRt9BWA6DeNbcudybMmodcrR2Cs7IkEaAnXiMi4o00tS7eRUTZ');
        try {
            //Se crea un intento de pago con el monto y la moneda
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount * 100,
                'currency' => 'usd',
                'description' => 'React Parking App',
                'setup_future_usage' => 'on_session'
            ]);

            $output = [
                'clientSecret' => $paymentIntent->client_secret,
            ];
            return response()->json($output);
        } catch (ErrorException $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }
}
