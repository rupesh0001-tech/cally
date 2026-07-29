import { SignIn } from "@clerk/react";

export default function LoginPage() {
  return (
    <SignIn
      path="/login"
      signUpUrl="/register"
      fallbackRedirectUrl="/onboard"
      forceRedirectUrl="/onboard"
    />
  );
}
