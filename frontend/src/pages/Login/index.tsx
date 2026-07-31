import { SignIn } from "@clerk/react";

export default function LoginPage() {
  return (
    <SignIn
      routing="hash"
      signUpUrl="/register"
      fallbackRedirectUrl="/onboard"
      forceRedirectUrl="/onboard"
    />
  );
}
