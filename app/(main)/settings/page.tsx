"use client";

import { User, Calendar, Volume2, Clock, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[rgba(255,255,255,0.4)] text-sm">
          Customize your experience
        </p>
      </div>

      {/* Settings sections */}
      <div className="space-y-6">
        {/* Account Section */}
        <section className="bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
          <h2 className="text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase tracking-wider mb-4">
            Account
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Demo User</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs">
                    Not signed in
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
              >
                Sign In
              </Button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                <div>
                  <p className="text-white text-sm">Google Calendar</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs">
                    Not connected
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
              >
                Connect
              </Button>
            </div>
          </div>
        </section>

        {/* Voice Section */}
        <section className="bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
          <h2 className="text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase tracking-wider mb-4">
            Voice
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                <div>
                  <p className="text-white text-sm">AI Voice Response</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs">
                    Speak confirmations aloud
                  </p>
                </div>
              </div>
              <button
                className="w-12 h-6 bg-[rgba(255,255,255,0.1)] rounded-full relative cursor-pointer"
              >
                <div className="absolute left-1 top-1 w-4 h-4 bg-[rgba(255,255,255,0.4)] rounded-full transition-all" />
              </button>
            </div>
          </div>
        </section>

        {/* Defaults Section */}
        <section className="bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
          <h2 className="text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase tracking-wider mb-4">
            Defaults
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                <div>
                  <p className="text-white text-sm">Meeting Duration</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs">
                    Default length for new meetings
                  </p>
                </div>
              </div>
              <select className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]">
                <option value="15">15 min</option>
                <option value="30" selected>30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                <div>
                  <p className="text-white text-sm">Timezone</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs">
                    Your local timezone
                  </p>
                </div>
              </div>
              <select className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]">
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Dubai">Dubai</option>
              </select>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-[rgba(20,20,25,0.8)] border border-[rgba(239,68,68,0.2)] rounded-xl p-4">
          <h2 className="text-[#EF4444] text-xs font-medium uppercase tracking-wider mb-4">
            Danger Zone
          </h2>

          <Button
            variant="outline"
            className="w-full border-[#EF4444] text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </section>
      </div>
    </div>
  );
}
