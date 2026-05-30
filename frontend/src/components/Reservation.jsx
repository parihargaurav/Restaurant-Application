import { useState, useEffect } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

// Must match backend TABLE_PRICES exactly
const TABLE_OPTIONS = [
  { value: "2-seater", label: "2-Seater",  price: 200,  icon: "🪑", desc: "Cozy table for 2" },
  { value: "4-seater", label: "4-Seater",  price: 400,  icon: "🍽️", desc: "Perfect for family" },
  { value: "6-seater", label: "6-Seater",  price: 600,  icon: "👨‍👩‍👧‍👦", desc: "Great for groups" },
  { value: "VIP",      label: "VIP Suite", price: 1500, icon: "👑", desc: "Premium experience" },
];

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [date,      setDate]      = useState("");
  const [time,      setTime]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [tableType, setTableType] = useState("2-seater");
  const [loading,   setLoading]   = useState(false);

  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const selectedTable = TABLE_OPTIONS.find((t) => t.value === tableType);

  // Minimum date = today
  const today = new Date().toISOString().split("T")[0];

  const handleReservation = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please sign in with Google first!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reservation/send`,
        { firstName, lastName, email, date, time, phone, tableType },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      const { reservationId, tablePrice } = res.data;

      // Reset
      setFirstName(""); setLastName(""); setEmail("");
      setDate(""); setTime(""); setPhone("");
      setTableType("2-seater");

      navigate(`/payment/${reservationId}`, { state: { tablePrice, tableType } });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server is not responding. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── Reservation Section ── */
        .reservation {
          padding: 80px 0;
          background: #1a1a1a;
        }
        .reservation .container {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .reservation .banner {
          flex: 1;
        }
        .reservation .banner img {
          width: 100%;
          border-radius: 16px;
          object-fit: cover;
          max-height: 640px;
        }

        /* ── Form Box ── */
        .reservation_form_box {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 36px 32px;
        }
        .reservation_form_box h1 {
          font-size: 26px;
          font-weight: 700;
          color: #c8a96e;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .reservation_form_box > p {
          color: #888;
          font-size: 14px;
          margin-bottom: 28px;
        }

        /* ── Booking-as pill ── */
        .booking-as {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1e1e1e;
          border: 1px solid #2a2a2a;
          border-radius: 30px;
          padding: 6px 14px 6px 8px;
          margin-bottom: 22px;
          width: fit-content;
        }
        .booking-as img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
        .booking-as span {
          font-size: 13px;
          color: #aaa;
        }
        .booking-as strong {
          color: #c8a96e;
        }

        /* ── Table Selector ── */
        .table-selector {
          margin-bottom: 24px;
        }
        .table-selector label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #888;
          margin-bottom: 10px;
        }
        .table-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .table-card {
          background: #1a1a1a;
          border: 1.5px solid #2a2a2a;
          border-radius: 10px;
          padding: 12px 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .table-card:hover {
          border-color: #c8a96e55;
          background: #1e1e1e;
        }
        .table-card.selected {
          border-color: #c8a96e;
          background: #1e1a12;
        }
        .table-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .table-card-name {
          font-size: 14px;
          font-weight: 600;
          color: #ddd;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .table-card.selected .table-card-name {
          color: #c8a96e;
        }
        .table-card-price {
          font-size: 13px;
          font-weight: 700;
          color: #c8a96e;
        }
        .table-card-desc {
          font-size: 11px;
          color: #666;
        }

        /* ── Price Preview Banner ── */
        .price-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #1e1a12, #211e14);
          border: 1px solid #c8a96e44;
          border-radius: 10px;
          padding: 12px 18px;
          margin-bottom: 22px;
        }
        .price-preview-left {
          font-size: 13px;
          color: #aaa;
        }
        .price-preview-left strong {
          color: #c8a96e;
          display: block;
          font-size: 12px;
          margin-top: 2px;
        }
        .price-preview-right {
          font-size: 24px;
          font-weight: 700;
          color: #c8a96e;
        }
        .price-preview-right span {
          font-size: 13px;
          font-weight: 400;
          color: #888;
        }

        /* ── Form Inputs ── */
        .res-form div {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
        }
        .res-form input,
        .res-form select {
          flex: 1;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 11px 14px;
          color: #000;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .res-form input::placeholder {
          color: #555;
        }
        .res-form input:focus,
        .res-form select:focus {
          border-color: #c8a96e;
        }
        .res-form select option {
          background: #1a1a1a;
        }

        /* ── Submit Button ── */
        .reserve-btn {
          width: 100%;
          background: linear-gradient(135deg, #c8a96e, #a07840);
          color: #000;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1.5px;
          padding: 14px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .reserve-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .reserve-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ── Auth Gate ── */
        .auth-gate {
          text-align: center;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .auth-gate-icon {
          font-size: 40px;
        }
        .auth-gate h3 {
          color: #c8a96e;
          font-size: 17px;
          font-weight: 600;
          margin: 0;
        }
        .auth-gate p {
          color: #777;
          font-size: 13px;
          margin: 0;
          max-width: 240px;
          line-height: 1.5;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .reservation .container {
            flex-direction: column;
          }
          .table-cards {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 500px) {
          .reservation_form_box {
            padding: 24px 18px;
          }
          .table-cards {
            grid-template-columns: 1fr;
          }
          .res-form div {
            flex-direction: column;
          }
        }
      `}</style>

      <section className="reservation" id="reservation">
        <div className="container">
          <div className="banner">
            <img src="/reservation.png" alt="reservation" />
          </div>

          <div className="banner">
            <div className="reservation_form_box">
              <h1>MAKE A RESERVATION</h1>
              <p>Book Your Table Now 📍</p>

              {!token ? (
                /* ── NOT LOGGED IN ── */
                <div className="auth-gate">
                  <div className="auth-gate-icon">🔒</div>
                  <h3>Sign in to Reserve a Table</h3>
                  <p>You need a Google account to make a reservation.</p>
                  <GoogleLoginButton />
                </div>
              ) : (
                /* ── LOGGED IN ── */
                <>
                  {/* Who is booking */}
                  <div className="booking-as">
                    <span>Booking as <strong>{user?.name}</strong></span>
                  </div>

                  {/* Table Type Selector */}
                  <div className="table-selector">
                    <label>Select Table Type</label>
                    <div className="table-cards">
                      {TABLE_OPTIONS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          className={`table-card ${tableType === t.value ? "selected" : ""}`}
                          onClick={() => setTableType(t.value)}
                        >
                          <div className="table-card-top">
                            <span className="table-card-name">
                              {t.icon} {t.label}
                            </span>
                            <span className="table-card-price">₹{t.price}</span>
                          </div>
                          <div className="table-card-desc">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Price Preview */}
                  <div className="price-preview">
                    <div className="price-preview-left">
                      Table Booking Price
                      <strong>{selectedTable.icon} {selectedTable.label} · {selectedTable.desc}</strong>
                    </div>
                    <div className="price-preview-right">
                      ₹{selectedTable.price} <span>/ booking</span>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <form className="res-form" onSubmit={handleReservation}>
                    <div>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={date}
                        min={today}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        className="email_tag"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone (10 digits)"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                        required
                      />
                    </div>

                    <button type="submit" className="reserve-btn" disabled={loading}>
                      {loading ? "Processing..." : <>RESERVE NOW <HiOutlineArrowNarrowRight /></>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Reservation;