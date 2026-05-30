import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

resend.emails
  .send({
    from: "onboarding@resend.dev",
    to: "thelonegaurav001@gmail.com",
    subject: "Test Connection",
    html: "<p>Resend connection test</p>",
  })
  .then(({ error }) => {
    if (error) console.log("❌ Email connection failed:", error);
    else        console.log("✅ Email server is ready to send messages");
  });

export const sendBookingEmail = async (reservation, paymentIntent, toEmail) => {
  const {
    firstName, lastName,
    date, time, tableType, tablePrice,
  } = reservation;

  const TABLE_ICONS = {
    "2-seater": "🪑",
    "4-seater": "🍽️",
    "6-seater": "👨‍👩‍👧‍👦",
    "VIP":      "👑",
  };
  const tableIcon  = TABLE_ICONS[tableType] ?? "🪑";
  const bookedOn   = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a1a 0%,#2d1f0e 100%);padding:32px 24px;text-align:center">
      <h1 style="margin:0;color:#c8a96e;font-size:28px;letter-spacing:3px">🍽️ DineEase</h1>
      <p style="margin:8px 0 0;color:#a0825a;font-size:14px;letter-spacing:1px">BOOKING CONFIRMATION</p>
    </div>

    <!-- Success Badge -->
    <div style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:16px 24px;text-align:center">
      <span style="display:inline-block;background:#dcfce7;color:#166534;padding:8px 20px;border-radius:30px;font-weight:700;font-size:14px">
        ✅ Payment Confirmed — Your Table is Booked!
      </span>
    </div>

    <!-- Greeting -->
    <div style="padding:28px 28px 0">
      <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:20px">Hi ${firstName} ${lastName} 👋</h2>
      <p style="margin:0;color:#555;font-size:14px;line-height:1.7">
        Thank you for choosing <strong>DineEase</strong>. Your reservation is confirmed and
        your table is waiting. Here's your full receipt:
      </p>
    </div>

    <!-- Reservation Details -->
    <div style="margin:24px 28px 0">
      <div style="background:#fafafa;border:1px solid #efefef;border-radius:10px;overflow:hidden">

        <div style="background:#f5f0e8;padding:12px 20px;border-bottom:1px solid #ece5d6">
          <span style="font-size:12px;font-weight:700;color:#8b6914;text-transform:uppercase;letter-spacing:0.1em">
            📋 Reservation Details
          </span>
        </div>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:150px">👤 Guest Name</td>
            <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-weight:600;font-size:14px">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">📅 Date</td>
            <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-weight:600;font-size:14px">${date}</td>
          </tr>
          <tr>
            <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">⏰ Time Slot</td>
            <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-weight:600;font-size:14px">${time}</td>
          </tr>
          <tr>
            <td style="padding:14px 20px;color:#888;font-size:13px">🪑 Table Type</td>
            <td style="padding:14px 20px">
              <span style="background:#fef3c7;color:#92400e;padding:4px 14px;border-radius:20px;font-weight:700;font-size:13px">
                ${tableIcon} ${tableType}
              </span>
            </td>
          </tr>
        </table>

      </div>
    </div>

    <!-- Payment Receipt -->
    <div style="margin:16px 28px 0">
      <div style="background:#fafafa;border:1px solid #efefef;border-radius:10px;overflow:hidden">

        <div style="background:#f0fdf4;padding:12px 20px;border-bottom:1px solid #bbf7d0">
          <span style="font-size:12px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.1em">
            💳 Payment Receipt
          </span>
        </div>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:12px 20px;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Item</td>
            <td style="padding:12px 20px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:13px;text-align:right">${tableIcon} ${tableType} Table Booking</td>
          </tr>
          <tr>
            <td style="padding:12px 20px;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Booked On</td>
            <td style="padding:12px 20px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:13px;text-align:right">${bookedOn}</td>
          </tr>
          <tr>
            <td style="padding:12px 20px;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px">Payment Method</td>
            <td style="padding:12px 20px;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:13px;text-align:right">💳 Card via Stripe</td>
          </tr>
          <tr>
            <td style="padding:12px 20px;border-bottom:2px dashed #e5e5e5;color:#888;font-size:13px">Status</td>
            <td style="padding:12px 20px;border-bottom:2px dashed #e5e5e5;text-align:right">
              <span style="background:#dcfce7;color:#166534;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700">✔ Paid</span>
            </td>
          </tr>
          <!-- Total -->
          <tr style="background:#f9fafb">
            <td style="padding:18px 20px;color:#1a1a1a;font-size:16px;font-weight:700">Total Paid</td>
            <td style="padding:18px 20px;text-align:right;font-size:26px;font-weight:700;color:#16a34a">₹${tablePrice}</td>
          </tr>
        </table>

      </div>
    </div>

    <!-- Payment ID -->
    <div style="margin:16px 28px 0;background:#f8f8f8;border:1px solid #efefef;border-radius:10px;padding:14px 20px">
      <p style="margin:0 0 6px;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.08em">🧾 Stripe Payment Reference</p>
      <p style="margin:0;font-family:monospace;font-size:12px;color:#555;word-break:break-all">${paymentIntent.id}</p>
    </div>

    <!-- Reminder Note -->
    <div style="margin:16px 28px 0;background:#fffbeb;border-left:4px solid #c8a96e;border-radius:0 8px 8px 0;padding:14px 18px">
      <p style="margin:0;font-size:13px;color:#555;line-height:1.7">
        📌 <strong>Please arrive 10 minutes early.</strong> For modifications or cancellations,
        contact us at least <strong>2 hours</strong> before your slot.
      </p>
    </div>

    <!-- Sent To -->
    <div style="padding:20px 28px 8px;text-align:center">
      <p style="margin:0;font-size:12px;color:#aaa">
        Confirmation sent to <strong style="color:#555">${toEmail}</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#1a1a1a;padding:20px 24px;text-align:center;margin-top:20px">
      <p style="margin:0 0 4px;color:#c8a96e;font-size:14px;font-weight:700;letter-spacing:2px">DineEase</p>
      <p style="margin:0;color:#555;font-size:12px">© ${new Date().getFullYear()} DineEase — Smart Restaurant Reservations</p>
    </div>

  </div>`;

  try {
    const { data, error } = await resend.emails.send({
      from: "DineEase <onboarding@resend.dev>",
      to: ["thelonegaurav001@gmail.com"],
      subject: `✅ Table Booked — ${date} at ${time}`,
      html,
    });

    if (error) {
      console.error("❌ Failed to send email:", error);
      throw new Error("Email sending failed");
    }

    console.log("✅ Email sent:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};

export default resend;