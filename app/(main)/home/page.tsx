"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { VoiceButton } from "@/components/VoiceButton";
import { ResultCard } from "@/components/ResultCard";
import { AmbientGlow } from "@/components/AmbientGlow";
import { useAppStore } from "@/stores/appStore";
import type { VoiceState, ActionTaken } from "@/types";

export default function HomePage() {
  const {
    voiceState,
    setVoiceState,
    recentActions,
    setRecentActions,
    responseText,
    setResponseText,
    isResultCardVisible,
    showResultCard,
    hideResultCard,
  } = useAppStore();

  const handleVoiceClick = useCallback(async () => {
    if (voiceState === "ready") {
      // Start listening
      setVoiceState("listening");

      // Simulate listening for 3 seconds (will be replaced with actual voice recording)
      setTimeout(() => {
        setVoiceState("processing");

        // Simulate AI processing (will be replaced with actual API call)
        setTimeout(() => {
          // Mock response
          const mockActions: ActionTaken[] = [
            { type: "event", id: "1", title: "Meeting with Ahmed - Tue 2:00 PM" },
            { type: "task", id: "2", title: "Finish Odoo deck" },
            { type: "reminder", id: "3", title: "Email Professor Faris" },
          ];

          setRecentActions(mockActions);
          setResponseText(
            "Got it! I've scheduled your meeting with Ahmed, added the deck to your tasks, and set a reminder for the email."
          );
          setVoiceState("success");
          showResultCard();

          // Reset to ready after showing success
          setTimeout(() => {
            setVoiceState("ready");
          }, 1000);
        }, 2000);
      }, 3000);
    } else if (voiceState === "listening") {
      // Stop listening early
      setVoiceState("processing");

      // Continue with processing simulation
      setTimeout(() => {
        const mockActions: ActionTaken[] = [
          { type: "task", id: "1", title: "Sample task created" },
        ];

        setRecentActions(mockActions);
        setResponseText("Got it! I've added that to your tasks.");
        setVoiceState("success");
        showResultCard();

        setTimeout(() => {
          setVoiceState("ready");
        }, 1000);
      }, 2000);
    }
  }, [voiceState, setVoiceState, setRecentActions, setResponseText, showResultCard]);

  const handleDismissCard = useCallback(() => {
    hideResultCard();
    setRecentActions([]);
    setResponseText(null);
  }, [hideResultCard, setRecentActions, setResponseText]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full px-6 overflow-hidden">
      {/* Ambient background glow */}
      <AmbientGlow state={voiceState} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Title */}
        <h1 className="text-3xl font-bold text-white mb-2">VocaLendar</h1>
        <p className="text-[rgba(255,255,255,0.6)] text-sm mb-12">
          Your voice, your schedule
        </p>

        {/* Voice Button */}
        <VoiceButton state={voiceState} onClick={handleVoiceClick} />

        {/* Result Card */}
        <div className="mt-8 w-full flex justify-center">
          <AnimatePresence>
            {isResultCardVisible && recentActions.length > 0 && (
              <ResultCard
                actions={recentActions}
                responseText={responseText || ""}
                onDismiss={handleDismissCard}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
