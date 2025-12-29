"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Mic } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
      },
    });

    if (error) {
      console.error("Error logging in:", error.message);
    }
  };

  // For demo/development: skip login
  const handleDemoMode = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 glow-ready ambient-glow" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center mb-6 animate-pulse-ready">
          <Mic className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">VocaLendar</h1>
        <p className="text-[rgba(255,255,255,0.6)] mb-8">
          Your voice-first scheduling assistant
        </p>

        {/* Description */}
        <p className="text-[rgba(255,255,255,0.4)] text-sm mb-8">
          Sign in with Google to sync your calendar and start scheduling with
          your voice.
        </p>

        {/* Login buttons */}
        <div className="w-full space-y-4">
          <Button
            onClick={handleGoogleLogin}
            size="lg"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(255,255,255,0.1)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-[rgba(255,255,255,0.4)]">
                or
              </span>
            </div>
          </div>

          <Button
            onClick={handleDemoMode}
            variant="outline"
            size="lg"
            className="w-full border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)] py-6"
          >
            Try Demo Mode
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[rgba(255,255,255,0.3)] text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
