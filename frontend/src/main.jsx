import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";  // ✅ Import AuthProvider
import App from "./App.jsx";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>  {/* ✅ Add AuthProvider HERE */}
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);