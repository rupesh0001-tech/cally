import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";

export function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useApi();
  const navigate = useNavigate();

  // Redirect if username already set
  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        const user = res.data.user;
        if (user && user.username) {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Onboarding username precheck failed:", err);
      });
  }, []);

  // Validate format and check availability with debounce
  useEffect(() => {
    if (!username) {
      setStatus("idle");
      setErrorMsg("");
      return;
    }

    const regex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!regex.test(username)) {
      setStatus("invalid");
      setErrorMsg("Must be 3-30 characters containing only letters, numbers, underscores, or hyphens.");
      return;
    }

    setErrorMsg("");
    setStatus("checking");

    const delay = setTimeout(async () => {
      try {
        const res = await api.get(`/users/username/check?username=${username}`);
        if (res.data.available) {
          setStatus("available");
        } else {
          setStatus("taken");
        }
      } catch (err: any) {
        setStatus("idle");
        setErrorMsg("Failed to check username availability.");
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "available" || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.put("/users/username", { username });
      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to set username. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px]">
      {/* Mini Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b-2 border-[#171614] bg-white">
        <Logo to="" />
      </header>

      {/* Onboarding Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[#171614] rounded-2xl p-8 shadow-[6px_6px_0_#171614] transition-all">
            <h2 className="font-cal-sans text-2xl font-extrabold text-[#171614] uppercase tracking-wide mb-2 text-center">
              Claim Your Username
            </h2>
            <p className="text-sm text-[#2B2A27]/85 font-semibold text-center mb-6">
              Create your scheduling link just like Instagram. You can change this later.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Choose a username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#2B2A27]/50 select-none">
                    cally.so/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your-name"
                    required
                    className="w-full pl-20 pr-4 py-3.5 border-2 border-[#171614] rounded-xl text-sm bg-white focus:outline-none focus:ring-3 focus:ring-[#B7ACF7] transition-all font-bold text-[#171614] placeholder-[#2B2A27]/30"
                  />
                </div>

                {/* Status Helpers */}
                {status === "checking" && (
                  <p className="text-xs font-semibold text-[#171614]/65 animate-pulse">
                    Checking availability...
                  </p>
                )}
                {status === "available" && (
                  <p className="text-xs font-bold text-[#23C585]">
                    ✦ Username available!
                  </p>
                )}
                {status === "taken" && (
                  <p className="text-xs font-bold text-[#E5484D]">
                    ✕ Username already taken.
                  </p>
                )}
                {status === "invalid" && (
                  <p className="text-xs font-bold text-[#E5484D]">
                    ✕ {errorMsg}
                  </p>
                )}
                {errorMsg && status !== "invalid" && (
                  <p className="text-xs font-bold text-[#E5484D]">
                    ✕ {errorMsg}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                rounded="xl"
                size="md"
                className="w-full"
                disabled={status !== "available" || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Continue to Dashboard 🚀"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
export default OnboardingPage;
