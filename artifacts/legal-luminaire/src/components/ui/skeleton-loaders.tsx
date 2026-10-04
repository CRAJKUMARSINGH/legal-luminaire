/**
 * SkeletonLoaders — shimmer/pulse skeleton components for AI-heavy pages.
 * All loaders use the app's CSS variable palette so they work in both
 * light (parchment) and dark (deep indigo) modes.
 */

import { cn } from "@/lib/utils";

// ── Base shimmer block ────────────────────────────────────────────────────
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted animate-pulse",
        className
      )}
      aria-hidden="true"
    />
  );
}

// ── Research results skeleton ─────────────────────────────────────────────
export function ResearchSkeleton() {
  return (
    <div className="space-y-4" aria-label="शोध परिणाम लोड हो रहे हैं… / Loading research results…" role="status">
      {/* Score bar row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 text-center space-y-2">
            <Shimmer className="h-8 w-10 mx-auto" />
            <Shimmer className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border pb-0 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-9 w-28 rounded-none rounded-t-md" />
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-7 w-16 rounded-full" />
        ))}
      </div>

      {/* Precedent cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <div className="p-4 space-y-3 bg-muted/20">
            <div className="flex flex-wrap gap-2 items-center">
              <Shimmer className="h-5 w-48" />
              <Shimmer className="h-5 w-28" />
              <Shimmer className="h-5 w-20 rounded-full" />
              <Shimmer className="h-5 w-24 rounded-full" />
            </div>
            <Shimmer className="h-4 w-40" />
            <div className="space-y-1.5 mt-3">
              <Shimmer className="h-2 w-full" />
              <Shimmer className="h-2 w-full" />
              <Shimmer className="h-2 w-3/4" />
            </div>
          </div>
          <div className="p-4 space-y-2">
            <Shimmer className="h-16 w-full rounded-lg" />
            <Shimmer className="h-12 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Draft generation skeleton ─────────────────────────────────────────────
export function DraftSkeleton() {
  return (
    <div className="space-y-4" aria-label="ड्राफ्ट तैयार हो रहा है… / Generating draft…" role="status">
      {/* Agent pipeline skeleton */}
      <div className="border rounded-xl p-4 space-y-3">
        <Shimmer className="h-4 w-32 mb-1" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
            <Shimmer className="h-4 w-4 rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-4 w-36" />
              <Shimmer className="h-3 w-64" />
            </div>
          </div>
        ))}
      </div>

      {/* Draft output skeleton */}
      <div className="border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="space-y-1">
            <Shimmer className="h-4 w-36" />
            <Shimmer className="h-3 w-48" />
          </div>
          <div className="flex gap-2">
            <Shimmer className="h-8 w-16 rounded-md" />
            <Shimmer className="h-8 w-20 rounded-md" />
            <Shimmer className="h-8 w-14 rounded-md" />
          </div>
        </div>
        <div className="p-5 space-y-3">
          {/* Hindi text lines — wider to simulate Devanagari prose */}
          {Array.from({ length: 18 }).map((_, i) => (
            <Shimmer
              key={i}
              className={cn("h-4", i % 5 === 4 ? "w-2/3" : "w-full")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Verification report skeleton ──────────────────────────────────────────
export function VerificationSkeleton() {
  return (
    <div className="space-y-4" aria-label="सत्यापन रिपोर्ट लोड हो रही है… / Loading verification report…" role="status">
      {/* Score cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 text-center space-y-2">
            <Shimmer className="h-8 w-10 mx-auto" />
            <Shimmer className="h-3 w-14 mx-auto" />
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        <Shimmer className="h-9 w-36 rounded-none rounded-t-md" />
        <Shimmer className="h-9 w-28 rounded-none rounded-t-md" />
      </div>

      {/* Precedent rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shimmer className="h-4 w-4 rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Shimmer className="h-5 w-52" />
                <Shimmer className="h-5 w-32" />
                <Shimmer className="h-5 w-20 rounded-full" />
              </div>
              <Shimmer className="h-3 w-40" />
            </div>
            <Shimmer className="h-5 w-5 rounded-sm shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Timeline skeleton ─────────────────────────────────────────────────────
export function TimelineSkeleton() {
  return (
    <div
      className="relative"
      aria-label="टाइमलाइन लोड हो रही है… / Loading timeline…"
      role="status"
    >
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="relative pl-14">
            {/* Timeline dot */}
            <div className="absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-muted bg-background z-10" aria-hidden="true" />
            <div className="border rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-3">
                <Shimmer className="h-3 w-24" />
                <Shimmer className="h-4 w-16 rounded-full" />
              </div>
              <Shimmer className="h-5 w-64" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Case list skeleton ────────────────────────────────────────────────────
export function CaseListSkeleton() {
  return (
    <div className="space-y-3" aria-label="केस सूची लोड हो रही है… / Loading cases…" role="status">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Shimmer className="h-6 w-6 rounded-md shrink-0" />
              <div className="space-y-1.5">
                <Shimmer className="h-5 w-56" />
                <Shimmer className="h-3 w-36" />
              </div>
            </div>
            <div className="flex gap-2">
              <Shimmer className="h-5 w-14 rounded-full" />
              <Shimmer className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <div className="flex gap-2 pt-1">
            <Shimmer className="h-8 w-16 rounded-md" />
            <Shimmer className="h-8 w-20 rounded-md" />
            <Shimmer className="h-8 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Generic card skeleton (reusable) ─────────────────────────────────────
export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="border rounded-xl p-5 space-y-3" aria-hidden="true">
      <Shimmer className="h-5 w-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer key={i} className={cn("h-4", i === rows - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
