import { SignUp } from "@clerk/react";

export default function RegisterPage() {
  return (
    <SignUp
      routing="hash"
      signInUrl="/login"
      fallbackRedirectUrl="/onboard"
      forceRedirectUrl="/onboard"
    />
  );
}
