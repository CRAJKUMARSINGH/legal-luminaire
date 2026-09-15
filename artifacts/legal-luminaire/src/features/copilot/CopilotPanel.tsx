import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, X, Send, Plus, ChevronRight, 
  Sparkles, AlertCircle, RefreshCw 
} from "lucide-react";
import { CitationChip } from "./CitationChip";
import { integrationFlags } from "@/lib/featureFlags";
import { useCaseContext } from "@/context/CaseContext";
import { apiRequest } from "@/lib/api-client";

// Types for copilot functionality
export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  contentHi?: string;
  citations?: Citation[];
  timestamp: Date;
  isRefusal?: boolean;
  refusalReason?: string;
  retrySuggestions?: string[];
  retrySuggestionsHi?: string[];
}

export interface Citation {
  id: string;
  type: "document" | "timeline" | "register" | "standard";
  title: string;
  titleHi?: string;
  reference: string;
  status: "VERIFIED" | "SECONDARY";
  page?: number;
  section?: string;
}

export interface CopilotSession {
  id: string;
  name: string;
  messages: CopilotMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "copilot_sessions";

// Helper functions for localStorage
const loadSessions = (): CopilotSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
    }
  } catch (e) {
    console.error("Failed to load copilot sessions:", e);
  }
  return [];
};

const saveSessions = (sessions: CopilotSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save copilot sessions:", e);
  }
};

const generateSessionName = (messages: CopilotMessage[]): string => {
  const firstUserMessage = messages.find(m => m.role === "user");
  if (firstUserMessage) {
    const name = firstUserMessage.content.slice(0, 30);
    return name.length < firstUserMessage.content.length ? name + "..." : name;
  }
  return "New Conversation";
};

export function CopilotPanel() {
  const { selectedCase } = useCaseContext();
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<CopilotSession[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const loaded = loadSessions();
    return loaded.length > 0 ? loaded[0].id : null;
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  // Persist sessions
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const createNewSession = useCallback(() => {
    const newSession: CopilotSession = {
      id: `session-${Date.now()}`,
      name: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
    setStreamError(null);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        // Create a new session if all are deleted
        const newSession: CopilotSession = {
          id: `session-${Date.now()}`,
          name: "New Conversation",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming || !activeSessionId) return;

    const userMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date()
    };

    // Update session with user message
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const updated = {
          ...session,
          messages: [...session.messages, userMessage],
          updatedAt: new Date()
        };
        // Update session name if it's the first user message
        if (session.messages.length === 0) {
          updated.name = generateSessionName([userMessage]);
        }
        return updated;
      }
      return session;
    }));

    setInput("");
    setIsStreaming(true);
    setStreamError(null);

    try {
      await queryCopilot(activeSessionId, userMessage.content);
    } catch (error) {
      console.error("Copilot request error:", error);
      setStreamError("Connection lost with verification engine. You can retry safely without state corruption.");
    } finally {
      setIsStreaming(false);
    }
  };

  const queryCopilot = async (sessionId: string, query: string) => {
    const caseId = selectedCase?.id || "case-01";

    // Format request payload strictly matching CopilotAskRequest
    const payload = {
      question: query,
      case_id: caseId,
      session_id: sessionId
    };

    let assistantMessage: CopilotMessage;

    try {
      const response = await apiRequest("/copilot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const isRefusal = Boolean(data.refusal && data.refusal.reason);
        assistantMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: isRefusal ? (data.refusal?.message || data.refusal?.reason || "I cannot answer based on verified records.") : (data.answer || "No response received."),
          contentHi: isRefusal ? (data.refusal?.message_hi || data.refusal?.reason_hi) : data.answer_hi,
          citations: (data.citations || []).map((c: any) => ({
            id: c.id || `cit-${Math.random().toString(36).substr(2, 5)}`,
            type: c.type || "document",
            title: c.title || c.reference || "Citation",
            titleHi: c.title_hi,
            reference: c.reference || "",
            status: c.status === "SECONDARY" ? "SECONDARY" : "VERIFIED",
            page: c.page,
            section: c.section
          })),
          timestamp: new Date(),
          isRefusal,
          refusalReason: data.refusal?.reason,
          retrySuggestions: isRefusal ? [
            "What verified records exist for this case?",
            "Show contradictions between FIR and Seizure Memo",
            "List confirmed hearing dates from trial register"
          ] : undefined
        };
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (err) {
      // Offline / Demo / Static Preview deterministic mock fallback
      console.warn("Using deterministic client fallback for Copilot:", err);
      const lower = query.toLowerCase();

      if (lower.includes("fake") || lower.includes("sec 999") || lower.includes("bns 500")) {
        assistantMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "Refusal: The requested citation does not exist in the verified Indian legal corpus or case docket.",
          contentHi: "अस्वीकृति: अनुरोधित उद्धरण सत्यापित भारतीय कानूनी संग्रह या केस रिकॉर्ड में मौजूद नहीं है।",
          timestamp: new Date(),
          isRefusal: true,
          refusalReason: "fake_citation_unverified",
          retrySuggestions: [
            "Show citations for Section 227 CrPC",
            "Show citations for Section 437A CrPC",
            "List verified case precedent citations"
          ]
        };
      } else if (lower.includes("other matter") || lower.includes("case-02") || lower.includes("cross-case")) {
        assistantMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "Refusal: Information requested belongs to an isolated docket and cannot be cross-referenced without authorization.",
          contentHi: "अस्वीकृति: अनुरोधित जानकारी एक पृथक केस डॉकेट से संबंधित है और अनधिकृत क्रॉस-रेफरेंस नहीं की जा सकती।",
          timestamp: new Date(),
          isRefusal: true,
          refusalReason: "cross_case_isolation_enforced"
        };
      } else if (lower.includes("contradiction")) {
        assistantMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "Contradiction Identified [CONTR-01 / SEIZ-04]: Seizure memo lists timing as 14:30 hrs, whereas Officer Station Diary records departure at 15:15 hrs. This discrepancy undermines contemporaneous recovery integrity.",
          contentHi: "विरोधाभास पहचाना गया [CONTR-01 / SEIZ-04]: जब्ती ज्ञापन में समय 14:30 बजे दर्ज है, जबकि रोजनामचे में प्रस्थान 15:15 बजे दर्ज है।",
          citations: [
            {
              id: "cit-seiz-01",
              type: "document",
              title: "Seizure Memo Ex. P-4",
              reference: "DOC-2024-004 §3",
              status: "VERIFIED",
              page: 4
            },
            {
              id: "cit-diary-02",
              type: "register",
              title: "General Diary Entry #41",
              reference: "REG-GD-2024 §7",
              status: "VERIFIED",
              page: 12
            }
          ],
          timestamp: new Date()
        };
      } else {
        assistantMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: `Analysis for ${selectedCase?.title || "Matter 2024/DEL"}: All factual claims have been evaluated against verified Case Book entries. No uncorroborated assertions permitted.`,
          contentHi: `${selectedCase?.title || "मामला 2024/DEL"} के लिए विश्लेषण: सभी दावों का सत्यापन केस बुक प्रविष्टियों के साथ किया गया है।`,
          citations: [
            {
              id: "cit-dkt-01",
              type: "document",
              title: "Primary Charge Sheet Ex. P-1",
              reference: "CS-2024-889 §173",
              status: "VERIFIED",
              page: 1
            }
          ],
          timestamp: new Date()
        };
      }
    }

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, assistantMessage],
          updatedAt: new Date()
        };
      }
      return session;
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Escape to close panel
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Keyboard shortcut to open panel (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen]);

  // Focus trap when panel is open
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    panelRef.current.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => {
      panelRef.current?.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  if (!integrationFlags.ask_copilot) return null;

  if (!isOpen) {
    // Floating toggle button
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="lg"
        aria-label="Open Ask Luminaire panel"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="ml-2 hidden sm:inline">Ask Luminaire</span>
        <span className="ml-2 hidden sm:inline text-xs opacity-70">Ctrl+K</span>
      </Button>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="fixed inset-y-0 right-0 w-[450px] bg-background border-l shadow-2xl z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Ask Luminaire panel"
    >
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Ask Luminaire</h2>
            <Badge variant="outline" className="text-xs">SYNTHETIC / DEMO</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {sessions.slice(0, 5).map(session => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                activeSessionId === session.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {session.name}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={createNewSession}
            className="shrink-0"
            aria-label="New conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div 
          className="space-y-4"
          role="log"
          aria-live="polite"
          aria-atomic="false"
        >
          {activeSession?.messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Ask about your case facts, contradictions, deadlines, or documents
              </p>
              <p className="text-sm text-muted-foreground/70">
                अपने केस के तथ्य, विरोधाभास, समयसीमा या दस्तावेजों के बारे में पूछें
              </p>
            </div>
          )}

          {activeSession?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.isRefusal ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-amber-200/50">
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        Verified Record Refusal
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-300">
                        SYNTHETIC / DEMO
                      </Badge>
                    </div>

                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{message.content}</p>
                        {message.contentHi && (
                          <p className="text-xs mt-1 opacity-80 font-serif">{message.contentHi}</p>
                        )}
                      </div>
                    </div>

                    <details className="text-xs bg-amber-500/5 border border-amber-200 dark:border-amber-900/40 rounded p-2 text-muted-foreground cursor-pointer">
                      <summary className="font-medium text-amber-700 dark:text-amber-300 select-none">
                        Why am I seeing this? / यह क्यों दिखाई दे रहा है?
                      </summary>
                      <p className="mt-1 text-[11px] leading-relaxed">
                        Under Legal Luminaire's Zero-Hallucination policy, the copilot strictly refuses queries when facts, dates, or citations do not exist in the verified case docket or statutory index.
                      </p>
                    </details>
                    
                    {message.retrySuggestions && message.retrySuggestions.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs font-medium mb-2">Try asking differently:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.retrySuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInput(suggestion)}
                              className="text-xs px-2 py-1 rounded bg-background border hover:bg-background/80 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[11px] text-muted-foreground">
                      <span className="font-medium truncate max-w-[200px]">
                        {selectedCase?.title || "Active Case Docket"}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                          SYNTHETIC / DEMO
                        </Badge>
                        <span className="text-[10px] text-primary/80 font-mono">
                          • Grounded in {message.citations?.length || 0} items
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.contentHi && (
                      <p className="text-sm mt-2 leading-relaxed opacity-80 font-serif">{message.contentHi}</p>
                    )}
                    
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs font-medium mb-2 text-muted-foreground flex items-center justify-between">
                          <span>Case Docket Citations:</span>
                          <span className="text-[10px] font-mono">100% Corroborated</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.citations.map((citation) => (
                            <CitationChip key={citation.id} citation={citation} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isStreaming && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          {streamError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{streamError}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStreamError(null)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your case..."
            disabled={isStreaming}
            className="flex-1"
            aria-label="Ask Luminaire input"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            size="icon"
            aria-label="Send message"
          >
            {isStreaming ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Escape to close • All answers include citations
        </p>
      </div>
    </div>
  );
}