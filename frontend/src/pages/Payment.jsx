import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Lock, Calendar, Clock, Users, Tag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TABLE_META = {
  "2-seater": { icon: "🪑", label: "2-Seater",  desc: "Cozy table for 2"     },
  "4-seater": { icon: "🍽️", label: "4-Seater",  desc: "Perfect for family"   },
  "6-seater": { icon: "👨‍👩‍👧‍👦", label: "6-Seater",  desc: "Great for groups"    },
  "VIP":      { icon: "👑", label: "VIP Suite", desc: "Premium experience"   },
};

const Payment = () => {
  const { reservationId } = useParams();
  const { state }         = useLocation();          // { tablePrice, tableType }
  const { token, user }   = useAuth();
  const stripe            = useStripe();
  const elements          = useElements();
  const navigate          = useNavigate();

  // Fallback safely if someone lands here directly
  const tablePrice = state?.tablePrice ?? 499;
  const tableType  = state?.tableType  ?? "2-seater";
  const tableMeta  = TABLE_META[tableType] ?? TABLE_META["2-seater"];

  const [processing,    setProcessing]    = useState(false);
  const [cardError,     setCardError]     = useState("");
  const [cardComplete,  setCardComplete]  = useState(false);

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

    setProcessing(true);
    setCardError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-payment-intent`,
        { amount: tablePrice, reservationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setCardError(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/payments/confirm`,
          { paymentIntentId: result.paymentIntent.id, reservationId, amount: tablePrice },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate("/payment-success");
      }
    } catch (err) {
      setCardError(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <style>{`
        .payment-page {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .payment-wrapper {
          width: 100%;
          max-width: 480px;
        }

        /* ── Header ── */
        .pay-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .pay-header h1 {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .pay-header p {
          font-size: 13px;
          color: #666;
        }

        /* ── Card ── */
        .pay-card {
          background: #161616;
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          overflow: hidden;
        }

        /* ── Booking Summary ── */
        .booking-summary {
          background: linear-gradient(135deg, #1e1a12, #211e14);
          border-bottom: 1px solid #2a2a2a;
          padding: 22px 24px;
        }
        .booking-summary-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #c8a96e;
          margin-bottom: 14px;
        }
        .booking-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .booking-row:last-child { margin-bottom: 0; }
        .booking-row svg {
          color: #c8a96e;
          flex-shrink: 0;
          width: 15px;
          height: 15px;
        }
        .booking-row-label {
          font-size: 12px;
          color: #666;
          width: 80px;
          flex-shrink: 0;
        }
        .booking-row-value {
          font-size: 13px;
          color: #ddd;
          font-weight: 500;
        }
        .table-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #2a2316;
          border: 1px solid #c8a96e44;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 13px;
          color: #c8a96e;
          font-weight: 600;
        }

        /* ── Amount bar ── */
        .amount-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #2a2a2a;
          background: #111;
        }
        .amount-bar-left {
          font-size: 13px;
          color: #888;
        }
        .amount-bar-left span {
          display: block;
          font-size: 11px;
          color: #555;
          margin-top: 2px;
        }
        .amount-bar-right {
          font-size: 28px;
          font-weight: 700;
          color: #c8a96e;
        }

        /* ── Form ── */
        .pay-form {
          padding: 24px;
        }
        .pay-form-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #888;
          margin-bottom: 12px;
          display: block;
        }

        /* ── Card brands ── */
        .card-brands {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .card-brands-label {
          font-size: 14px;
          font-weight: 500;
          color: #ccc;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-brands-icons {
          display: flex;
          gap: 6px;
        }
        .card-brands-icons img {
          height: 24px;
          border-radius: 4px;
        }

        /* ── Stripe card element wrapper ── */
        .card-element-box {
          background: #1a1a1a;
          border: 1.5px solid #2a2a2a;
          border-radius: 10px;
          padding: 14px 16px;
          transition: border-color 0.2s;
          margin-bottom: 8px;
        }
        .card-element-box:focus-within {
          border-color: #c8a96e;
        }
        .card-error {
          font-size: 12px;
          color: #f87171;
          margin-bottom: 10px;
          min-height: 18px;
        }
        .card-note {
          font-size: 12px;
          color: #555;
          margin-bottom: 20px;
        }

        /* ── Pay button ── */
        .pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #c8a96e, #a07840);
          color: #000;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.5px;
          padding: 15px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .pay-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .pay-btn:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
          transform: none;
        }
        .pay-btn svg { width: 16px; height: 16px; }

        /* ── Spinner ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid #00000033;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ── Footer ── */
        .pay-footer {
          text-align: center;
          font-size: 12px;
          color: #444;
          padding: 16px 24px;
          border-top: 1px solid #1e1e1e;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        @media (max-width: 500px) {
          .booking-summary { padding: 18px; }
          .pay-form { padding: 18px; }
          .amount-bar { padding: 14px 18px; }
        }
      `}</style>

      <div className="payment-page">
        <div className="payment-wrapper">

          {/* Header */}
          <div className="pay-header">
            <h1>Complete Your Booking</h1>
            <p>Payments are encrypted and processed securely</p>
          </div>

          <div className="pay-card">

            {/* ── Booking Summary ── */}
            <div className="booking-summary">
              <div className="booking-summary-title">📋 Booking Summary</div>

              <div className="booking-row">
                <Tag size={15} />
                <span className="booking-row-label">Table</span>
                <span className="booking-row-value">
                  <span className="table-badge">
                    {tableMeta.icon} {tableMeta.label}
                  </span>
                </span>
              </div>

              <div className="booking-row">
                <Users size={15} />
                <span className="booking-row-label">Type</span>
                <span className="booking-row-value">{tableMeta.desc}</span>
              </div>

              {user?.name && (
                <div className="booking-row">
                  <Calendar size={15} />
                  <span className="booking-row-label">Guest</span>
                  <span className="booking-row-value">{user.name}</span>
                </div>
              )}

              <div className="booking-row">
                <Clock size={15} />
                <span className="booking-row-label">Booking ID</span>
                <span className="booking-row-value" style={{ fontSize: "11px", color: "#555" }}>
                  #{reservationId?.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>

            {/* ── Amount ── */}
            <div className="amount-bar">
              <div className="amount-bar-left">
                Total Amount
                <span>Table booking · {tableMeta.label}</span>
              </div>
              <div className="amount-bar-right">₹{tablePrice}</div>
            </div>

            {/* ── Payment Form ── */}
            <form className="pay-form" onSubmit={handlePayment}>
              <span className="pay-form-label">Card Details</span>

              <div className="card-brands">
                <span className="card-brands-label">
                  <input type="radio" checked readOnly style={{ accentColor: "#c8a96e" }} />
                  Credit / Debit Card
                </span>
                <div className="card-brands-icons">
                  <img src="https://img.icons8.com/color/36/visa.png"       alt="visa" />
                  <img src="https://img.icons8.com/color/36/mastercard.png" alt="mc"   />
                  <img src="https://img.icons8.com/color/36/amex.png"       alt="amex" />
                </div>
              </div>

              <div className="card-element-box">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "15px",
                        color: "#dddddd",
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        "::placeholder": { color: "#555" },
                        iconColor: "#c8a96e",
                      },
                      invalid: { color: "#f87171", iconColor: "#f87171" },
                    },
                  }}
                  onChange={handleCardChange}
                />
              </div>

              <p className="card-error">{cardError}</p>
              <p className="card-note">Billing info is same as reservation details</p>

              <button
                type="submit"
                className="pay-btn"
                disabled={!stripe || processing || !cardComplete}
              >
                {processing ? (
                  <><div className="spinner" /> Processing...</>
                ) : (
                  <><Lock size={16} /> Pay ₹{tablePrice} Securely</>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="pay-footer">
              <Lock size={12} />
              Secured by Stripe &nbsp;•&nbsp; PCI-DSS compliant
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;