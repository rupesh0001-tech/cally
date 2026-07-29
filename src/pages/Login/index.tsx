import { useEffect } from "react";
import { SignIn, useSignIn } from "@clerk/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const { isLoaded, signIn } = useSignIn();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && location.pathname !== "/login" && (!signIn || !signIn.status)) {
      navigate("/login", { replace: true });
    }
  }, [isLoaded, signIn, location.pathname, navigate]);

  return (
    <SignIn
      path="/login"
      routing="path"
      signUpUrl="/register"
      fallbackRedirectUrl="/onboard"
      forceRedirectUrl="/onboard"
    />
  );
}
