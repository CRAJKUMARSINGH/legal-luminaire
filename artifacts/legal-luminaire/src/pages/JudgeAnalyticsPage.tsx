/**
 * Judge Analytics Page
 * Route wrapper for Phase 5: Judge Analytics
 * Path: /case/:id/judge-analytics
 */

import { JudgeProfileCard } from "@/components/JudgeProfileCard";
import { CourtAnalyticsDashboard } from "@/components/CourtAnalyticsDashboard";
import { featureFlags } from "@/config/featureFlags";
import { useState } from "react";
import { Link } from "wouter";

export default function JudgeAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"judges" | "courts">("judges");

  if (!featureFlags.enableJudgeAnalytics && !featureFlags.enableCourtAnalytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Analytics is disabled. Set{" "}
          <code className="bg-muted px-1 rounded">VITE_FF_ENABLE_JUDGE_ANALYTICS=true</code>{" "}
          to activate.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold text-foreground">Judge & Court Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Decision patterns, bail rates, conviction trends, disposal speed
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card px-6">
        {(["judges", "courts"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "judges" ? "Judge Profiles" : "Court Analytics"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "courts" ? (
          <CourtAnalyticsDashboard />
        ) : (
          <div className="text-sm text-center py-16 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <p className="font-semibold text-lg text-foreground mb-2">
              Judge Profiles / न्यायाधीश प्रोफाइल
            </p>
            <p className="text-muted-foreground mb-1">
              Load judgment records to analyse decision patterns, bail rates, and disposal trends.
            </p>
            <p className="text-muted-foreground mb-6 text-sm">
              निर्णय पैटर्न, जमानत दरें और निपटान रुझानों का विश्लेषण करने के लिए निर्णय रिकॉर्ड लोड करें।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/cases"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Load Demo Case
                <span className="text-xs opacity-80 block sm:hidden sm:inline">/ डेमो केस</span>
              </Link>

              <Link
                to="/new-case-ingest"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-background font-medium text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Upload Judgments
                <span className="text-xs opacity-80">/ अपलोड</span>
              </Link>

              <a
                href="https://lawfaculty.du.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-background font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                View Docs / दस्तावेज़
              </a>
            </div>

            <p className="mt-8 text-xs text-muted-foreground/70">
              Use the <code className="bg-muted px-1 rounded">buildJudgeProfile()</code> API with your case data for programmatic integration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}