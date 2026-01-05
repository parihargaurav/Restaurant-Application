import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";

const Payment = () => {
  const { reservationId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const amount = 499;
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (e) => {
    setCardError(e.error ? e.error.message : "");
    setCardComplete(e.complete);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    if (!cardComplete) {
      setCardError("Please complete your card details.");
      return;
    }

    try {
      setProcessing(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/payments/create-payment-intent",
        { amount, reservationId }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setCardError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        await axios.post("http://localhost:5000/api/v1/payments/confirm", {
          paymentIntentId: result.paymentIntent.id,
          reservationId,
          amount,
        });

        navigate("/payment-success");
      }
    } catch (err) {
      setCardError(
        err.response?.data?.message || err.message || "Payment failed"
      );
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        "::placeholder": {
          color: "#9ca3af",
        },
        iconColor: "#6366f1",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex !items-center !justify-center px-4 py-10">
      <div className="w-full max-w-lg mx-auto !text-center">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Secure checkout
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Payments are encrypted and processed securely
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Amount */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-2xl font-semibold">₹{amount}</p>
            </div>
          </div>

          {/* Payment Method */}
          <form onSubmit={handlePayment} className="px-6 py-5 space-y-5 !text-left">
            <h2 className="text-sm font-medium text-gray-900">
              Payment method
            </h2>

            {/* Card Method */}
            <div className="border rounded-lg p-4 space-y-4">
              {/* Radio Header */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="font-medium text-gray-900">Card</span>
                </label>

                {/* Card Icons */}
                <div className="flex gap-2">
                  <img
                    src="https://img.icons8.com/color/36/visa.png"
                    alt="visa"
                  />
                  <img
                    src="https://img.icons8.com/color/36/mastercard.png"
                    alt="mc"
                  />
                  <img
                    src="https://img.icons8.com/color/36/amex.png"
                    alt="amex"
                  />
                </div>
              </div>

              {/* Card Input */}
              <div className="border rounded-md px-3 py-3 bg-white">
                <CardElement
                  options={cardElementOptions}
                  onChange={handleCardChange}
                />
              </div>

              {cardError && <p className="text-sm text-red-600">{cardError}</p>}

              <p className="text-xs text-gray-500">
                Billing info is same as reservation details
              </p>
            </div>

            {/* Disabled Options */}
           

            {/* Pay Button */}
            <button
              type="submit"
              disabled={!stripe || processing || !cardComplete}
              className={`w-full py-3 mt-2 rounded-md text-white font-medium transition flex items-center justify-center gap-2
              ${
                processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }
            `}
            >
              {processing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ₹{amount}
                </>
              )}
            </button>

            {/* Footer */}
            <div className="text-xs text-gray-400 text-center pt-3">
              Secured by Stripe • PCI-DSS compliant
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
