/* eslint-disable no-unused-vars */
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        { credential: credentialResponse.credential }
      );
      login(data.token, data.user);
      toast.success(`Welcome ${data.user.name}!`);
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Google login failed")}
    />
  );
}
