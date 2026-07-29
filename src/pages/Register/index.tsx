import { SignUp } from "@clerk/react";

export default function RegisterPage() {
  return (
    <SignUp
      path="/register"
      signInUrl="/login"
      fallbackRedirectUrl="/onboard"
      forceRedirectUrl="/onboard"
    />
  );
}
