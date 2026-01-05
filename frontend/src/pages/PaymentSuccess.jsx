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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-40 py-8 mr-50">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-green-100">
          
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2   !px-40 mr-40">
              Payment Successful! 🎉
            </h1>
            <p className="text-green-50 text-sm">
              Your reservation is confirmed
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 text-center">
            
            {/* Sandwich Image */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img 
                  src="/sandwich.png" 
                  alt="success" 
                  className="w-48 h-48 object-contain drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Thank You for Your Reservation! 🍽️
              </h2>
              
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl py-4 px-6 mb-6 shadow-inner">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  
                  </div>
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Redirecting to home</p>
                  <p className="text-xs text-gray-500">in {countdown} seconds</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5" />
                Go to Home
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              
            </div>

            
          </div>
        </div>

        
      </div>
  
  );
};

export default PaymentSuccess;