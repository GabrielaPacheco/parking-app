import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

export default function CheckoutForm({setAmount}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js todavia no ha sido cargado.
      //Asegurarse de deshabilitarlo hasta que Stripe este cargado.
      return;
    }

    setIsProcessing(true);

    const response = await stripe.confirmPayment({
      elements,
      confirmParams: {
      },
      redirect: "if_required",
    });

    if (
      (response.error && response.error.type === "card_error") ||
      (response.error && response.error.type === "validation_error")
    ) {
      setMessage(response.error.message);
    } else if (response.paymentIntent.id) {
      //display success message or redirect user
      localStorage.removeItem('amount');
      setAmount(0);
      toast.success("El pago ha sido realizado. Muchas gracias.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Procesando ... " : "Pagar ahora"}
        </span>
      </button>
      {/* Muestra cualquier mensaje de error o de exitoso */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
