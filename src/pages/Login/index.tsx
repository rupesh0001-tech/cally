import { SignIn } from "@clerk/react";

export default function LoginPage() {
  return (
    <SignIn
      routing="path"
      path="/login"
      signUpUrl="/register"
      fallbackRedirectUrl="/onboard"
      forceRedirectUrl="/onboard"
    />
  );
}
