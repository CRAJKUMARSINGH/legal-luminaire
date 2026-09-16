/**
 * BilingualSideBySideEditor
 *
 * Split-pane editor with synchronized scrolling between a Hindi panel (right)
 * and an English panel (left). Entirely self-contained — passes content up via
 * onChange callbacks so the parent page owns the state.
 *
 * Features
 *  - Synchronized scroll (both panels scroll together when in sync-mode)
 *  - Per-panel word-count and character-count
 *  - Language-swap button (quick mirror / paste from one panel to the other)
 *  - Optional read-only mode for either panel (review flow)
 *  - Compact toolbar: bold marker, italic marker, heading marker
 *  - Accessibility: aria-labels, focus-visible outlines
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftRight,
  Lock,
  Unlock,
  Copy,
  AlignLeft,
  Type,
} from "lucide-react";

/* ── Types ───────────────────────────────────────────────────────────────── */
export type PanelSide = "en" | "hi";

export interface BilingualContent {
  en: string;
  hi: string;
}

export interface BilingualSideBySideEditorProps {
  value: BilingualContent;
  onChange: (updated: BilingualContent) => void;
  /** If true, neither panel can be edited — review mode */
  readOnly?: boolean;
  /** Lock one side as read-only while the other is editable */
  readOnlySide?: PanelSide;
  /** Height of each textarea in px (default 520) */
  height?: number;
  /** Show word / char count badges */
  showCounts?: boolean;
  /** Called when user clicks the "Copy EN→HI" or "Copy HI→EN" swap */
  onSwap?: (from: PanelSide) => void;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function wordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function insertMarker(text: string, start: number, end: number, marker: string): string {
  const before = text.slice(0, start);
  const selected = text.slice(start, end);
  const after = text.slice(end);
  return `${before}${marker}${selected || "…"}${marker}${after}`;
}

/* ── Toolbar ─────────────────────────────────────────────────────────────── */
function PanelToolbar({
  textareaRef,
  value,
  onChange,
  readOnly,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const wrap = (marker: string) => {
    const ta = textareaRef.current;
    if (!ta || readOnly) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const next = insertMarker(value, s, e, marker);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + marker.length, e + marker.length);
    });
  };

  return (
    <div className="flex gap-1 px-2 py-1 border-b bg-muted/40">
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        title="Bold (wrap with **)"
        disabled={readOnly}
        onClick={() => wrap("**")}
        aria-label="Bold"
      >
        <span className="font-bold text-xs">B</span>
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        title="Italic (wrap with *)"
        disabled={readOnly}
        onClick={() => wrap("*")}
        aria-label="Italic"
      >
        <span className="italic text-xs">I</span>
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        title="Heading (prefix ##)"
        disabled={readOnly}
        onClick={() => {
          const ta = textareaRef.current;
          if (!ta || readOnly) return;
          const s = ta.selectionStart;
          const lineStart = value.lastIndexOf("\n", s - 1) + 1;
          const next = value.slice(0, lineStart) + "## " + value.slice(lineStart);
          onChange(next);
        }}
        aria-label="Heading"
      >
        <Type className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        title="Justify / paragraph"
        disabled={readOnly}
        onClick={() => {
          const ta = textareaRef.current;
          if (!ta || readOnly) return;
          const s = ta.selectionStart;
          const lineStart = value.lastIndexOf("\n", s - 1) + 1;
          const next = value.slice(0, lineStart) + "\n" + value.slice(lineStart);
          onChange(next);
        }}
        aria-label="New paragraph"
      >
        <AlignLeft className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        title="Copy to clipboard"
        onClick={() => void navigator.clipboard.writeText(value)}
        aria-label="Copy to clipboard"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
}

/* ── Single Panel ─────────────────────────────────────────────────────────── */
function Panel({
  lang,
  label,
  value,
  onChange,
  readOnly,
  height,
  showCounts,
  textareaRef,
  onScroll,
  syncScroll,
}: {
  lang: PanelSide;
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  height: number;
  showCounts: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onScroll: () => void;
  syncScroll: boolean;
}) {
  const isHindi = lang === "hi";

  return (
    <div className="flex flex-col flex-1 min-w-0 border rounded-lg overflow-hidden">
      {/* Panel header */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 text-sm font-semibold border-b
          ${isHindi ? "bg-amber-50 text-amber-900" : "bg-blue-50 text-blue-900"}`}
      >
        <span>{label}</span>
        <div className="flex items-center gap-2">
          {readOnly ? (
            <Badge variant="outline" className="text-xs gap-1">
              <Lock className="h-2.5 w-2.5" /> Read-only
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs gap-1 text-emerald-700 border-emerald-300">
              <Unlock className="h-2.5 w-2.5" /> Editable
            </Badge>
          )}
          {syncScroll && (
            <Badge variant="secondary" className="text-xs">
              ⇕ Sync
            </Badge>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <PanelToolbar
        textareaRef={textareaRef}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        readOnly={readOnly}
        aria-label={`${label} text area`}
        dir={isHindi ? "auto" : "ltr"}
        lang={isHindi ? "hi" : "en"}
        style={{ height, resize: "none" }}
        className={`
          flex-1 w-full p-3 font-mono text-sm leading-relaxed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
          bg-background text-foreground
          ${readOnly ? "opacity-70 cursor-default" : ""}
          ${isHindi ? "font-[system-ui]" : ""}
        `}
        placeholder={
          isHindi
            ? "यहाँ हिंदी प्रारूप लिखें / पेस्ट करें…"
            : "Type or paste the English draft here…"
        }
        spellCheck={!isHindi}
      />

      {/* Footer counts */}
      {showCounts && (
        <div className="flex gap-4 px-3 py-1 text-xs text-muted-foreground border-t bg-muted/20">
          <span>{wordCount(value).toLocaleString()} words</span>
          <span>{value.length.toLocaleString()} chars</span>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function BilingualSideBySideEditor({
  value,
  onChange,
  readOnly = false,
  readOnlySide,
  height = 520,
  showCounts = true,
  onSwap,
}: BilingualSideBySideEditorProps) {
  const enRef = useRef<HTMLTextAreaElement>(null);
  const hiRef = useRef<HTMLTextAreaElement>(null);
  const [syncScroll, setSyncScroll] = useState(true);
  const isSyncing = useRef(false);

  /* Synchronized scroll handler */
  const handleScroll = useCallback(
    (source: PanelSide) => {
      if (!syncScroll || isSyncing.current) return;
      const from = source === "en" ? enRef.current : hiRef.current;
      const to = source === "en" ? hiRef.current : enRef.current;
      if (!from || !to) return;
      isSyncing.current = true;
      const pct =
        from.scrollTop / (from.scrollHeight - from.clientHeight || 1);
      to.scrollTop = pct * (to.scrollHeight - to.clientHeight);
      requestAnimationFrame(() => {
        isSyncing.current = false;
      });
    },
    [syncScroll],
  );

  /* Keyboard shortcut: Ctrl+Shift+S → toggle sync */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        setSyncScroll((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSwap = (from: PanelSide) => {
    const copied = from === "en" ? value.en : value.hi;
    if (from === "en") {
      onChange({ ...value, hi: copied });
    } else {
      onChange({ ...value, en: copied });
    }
    onSwap?.(from);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Button
          size="sm"
          variant={syncScroll ? "default" : "outline"}
          onClick={() => setSyncScroll((v) => !v)}
          title="Toggle synchronized scrolling (Ctrl+Shift+S)"
          className="gap-1.5"
        >
          ⇕ {syncScroll ? "Scroll Sync ON" : "Scroll Sync OFF"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          title="Copy English content into Hindi panel"
          onClick={() => handleSwap("en")}
          disabled={readOnly || readOnlySide === "hi"}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" /> EN → HI
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          title="Copy Hindi content into English panel"
          onClick={() => handleSwap("hi")}
          disabled={readOnly || readOnlySide === "en"}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" /> HI → EN
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">
          Ctrl+Shift+S — toggle scroll sync
        </span>
      </div>

      {/* Two panels side by side */}
      <div className="flex gap-3 w-full">
        <Panel
          lang="en"
          label="🇬🇧 English Draft"
          value={value.en}
          onChange={(v) => onChange({ ...value, en: v })}
          readOnly={readOnly || readOnlySide === "en"}
          height={height}
          showCounts={showCounts}
          textareaRef={enRef}
          onScroll={() => handleScroll("en")}
          syncScroll={syncScroll}
        />
        <Panel
          lang="hi"
          label="🇮🇳 हिंदी प्रारूप"
          value={value.hi}
          onChange={(v) => onChange({ ...value, hi: v })}
          readOnly={readOnly || readOnlySide === "hi"}
          height={height}
          showCounts={showCounts}
          textareaRef={hiRef}
          onScroll={() => handleScroll("hi")}
          syncScroll={syncScroll}
        />
      </div>
    </div>
  );
}
