import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Home, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <style>{`
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f0f;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .success-card {
          width: 100%;
          max-width: 440px;
          background: #161616;
          border: 1px solid #2a2a2a;
          border-radius: 24px;
          overflow: hidden;
        }

        /* ── Banner ── */
        .success-banner {
          background: linear-gradient(135deg, #16a34a, #059669);
          padding: 36px 24px;
          text-align: center;
        }
        .success-icon-ring {
          width: 80px;
          height: 80px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          animation: bounceIn 0.6s ease;
        }
        @keyframes bounceIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .success-banner h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }
        .success-banner p {
          font-size: 14px;
          color: #bbf7d0;
        }

        /* ── Body ── */
        .success-body {
          padding: 32px 28px;
          text-align: center;
        }
        .success-img {
          width: 130px;
          height: 130px;
          object-fit: contain;
          margin: 0 auto 24px;
          display: block;
          filter: drop-shadow(0 8px 24px #16a34a33);
        }
        .success-body h2 {
          font-size: 18px;
          font-weight: 600;
          color: #e5e5e5;
          margin-bottom: 8px;
        }
        .success-body p {
          font-size: 13px;
          color: #666;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        /* ── Countdown ── */
        .countdown-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          padding: 14px 20px;
          margin-bottom: 24px;
        }
        .countdown-dot {
          position: relative;
          width: 10px;
          height: 10px;
        }
        .countdown-dot-inner {
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          position: relative;
          z-index: 1;
        }
        .countdown-dot-ping {
          position: absolute;
          inset: 0;
          background: #22c55e;
          border-radius: 50%;
          animation: ping 1s ease-in-out infinite;
          opacity: 0.5;
        }
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        .countdown-text p:first-child {
          font-size: 13px;
          color: #aaa;
          margin: 0;
          text-align: left;
        }
        .countdown-text p:last-child {
          font-size: 12px;
          color: #555;
          margin: 0;
          text-align: left;
        }
        .countdown-number {
          font-size: 22px;
          font-weight: 700;
          color: #22c55e;
          margin-left: auto;
          min-width: 28px;
        }

        /* ── Buttons ── */
        .success-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: linear-gradient(135deg, #16a34a, #059669);
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          padding: 14px;
          border-radius: 12px;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }
        .success-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .success-btn svg { transition: transform 0.2s; }
        .success-btn:hover svg:last-child { transform: translateX(3px); }

        /* ── Footer ── */
        .success-footer {
          border-top: 1px solid #1e1e1e;
          padding: 16px 28px;
          text-align: center;
          font-size: 12px;
          color: #444;
        }
        .success-footer span {
          color: #c8a96e;
          font-weight: 600;
        }
      `}</style>

      <div className="success-page">
        <div className="success-card">

          {/* Banner */}
          <div className="success-banner">
            <div className="success-icon-ring">
              <CheckCircle size={44} color="#16a34a" strokeWidth={2.5} />
            </div>
            <h1>Payment Successful! 🎉</h1>
            <p>Your table reservation is confirmed</p>
          </div>

          {/* Body */}
          <div className="success-body">
            <img src="/sandwich.png" alt="success" className="success-img" />

            <h2>Thank You for Your Reservation! 🍽️</h2>
            <p>
              A confirmation email has been sent to your inbox.<br />
              We look forward to welcoming you!
            </p>

            {/* Countdown */}
            <div className="countdown-box">
              <div className="countdown-dot">
                <div className="countdown-dot-ping" />
                <div className="countdown-dot-inner" />
              </div>
              <div className="countdown-text">
                <p>Redirecting to home</p>
                <p>automatically</p>
              </div>
              <div className="countdown-number">{countdown}</div>
            </div>

            {/* CTA */}
            <Link to="/" className="success-btn">
              <Home size={18} />
              Go to Home
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Footer */}
          <div className="success-footer">
            Powered by <span>DineEase</span> &nbsp;•&nbsp; Secured by Stripe
          </div>

        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;