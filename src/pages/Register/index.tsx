import { useEffect } from "react";
import { SignUp, useSignUp } from "@clerk/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RegisterPage() {
  const { isLoaded, signUp } = useSignUp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && location.pathname !== "/register" && (!signUp || !signUp.status)) {
      navigate("/register", { replace: true });
    }
  }, [isLoaded, signUp, location.pathname, navigate]);

  return (
    <SignUp
      path="/register"
      routing="path"
      signInUrl="/login"
      fallbackRedirectUrl="/onboard"
      forceRedirectUrl="/onboard"
    />
  );
}
