"use client";

import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 glow-ready ambient-glow" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo/Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          VocaLendar
        </h1>
        <p className="text-[rgba(255,255,255,0.6)] text-lg mb-12">
          Your voice, your schedule
        </p>

        {/* Hero Microphone Button (Preview) */}
        <div className="relative mb-8">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center animate-pulse-ready cursor-pointer">
            <Mic className="w-12 h-12 text-white" />
          </div>
        </div>

        <p className="text-[rgba(255,255,255,0.4)] text-sm mb-8">
          Speak naturally. AI handles the rest.
        </p>

        {/* CTA Button */}
        <Link href="/home">
          <Button
            size="lg"
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-6 text-lg rounded-full"
          >
            Get Started
          </Button>
        </Link>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl">
          <div className="text-center">
            <div className="text-2xl mb-2">🎤</div>
            <h3 className="text-white font-medium mb-1">Voice First</h3>
            <p className="text-[rgba(255,255,255,0.4)] text-sm">
              Just speak your schedule
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-white font-medium mb-1">AI Powered</h3>
            <p className="text-[rgba(255,255,255,0.4)] text-sm">
              Claude understands context
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="text-white font-medium mb-1">Google Sync</h3>
            <p className="text-[rgba(255,255,255,0.4)] text-sm">
              Direct to your calendar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
