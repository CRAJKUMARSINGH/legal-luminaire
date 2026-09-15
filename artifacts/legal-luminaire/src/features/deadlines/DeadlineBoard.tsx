import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, AlertTriangle, CheckCircle2, 
  ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { apiRequest } from "@/lib/api-client";

interface DeadlineItem {
  rule_id: string;
  case_id: string;
  event_type: string;
  event_date: string | null;
  due_date: string | null;
  days_remaining: number | null;
  status: string;
  name: string;
  name_hi: string;
  basis_en: string;
  basis_hi: string;
  statute: string;
  section: string;
  source_note: string;
  period_days: number;
  period_basis: string;
  consequence: string;
  consequence_hi: string;
  computed_at: string;
  is_synthetic: boolean;
  completed: boolean;
}

interface DeadlineScheduleResponse {
  case_id: string;
  computed_at: string;
  total: number;
  status_counts: Record<string, number>;
  items: DeadlineItem[];
  disclaimer: string;
}

type BoardColumn = "upcoming" | "this_week" | "overdue" | "filed";

export function DeadlineBoard() {
  const { selectedCase } = useCaseContext();
  const [deadlines, setDeadlines] = useState<DeadlineScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"board" | "calendar">("board");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const caseId = selectedCase?.id || "TC-01";

  const fetchDeadlines = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/case/${caseId}/deadlines`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch deadlines");
      }
      
      const data: DeadlineScheduleResponse = await response.json();
      setDeadlines(data);
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColumnItems = (column: BoardColumn): DeadlineItem[] => {
    if (!deadlines) return [];
    
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return deadlines.items.filter(item => {
      if (item.completed) return column === "filed";
      
      const dueDate = item.due_date ? new Date(item.due_date) : null;
      if (!dueDate) return false;
      
      switch (column) {
        case "overdue":
          return item.status === "OVERDUE";
        case "this_week":
          return item.status === "URGENT" && dueDate <= weekFromNow;
        case "upcoming":
          return item.status === "UPCOMING" || (item.status === "URGENT" && dueDate > weekFromNow);
        case "filed":
          return item.completed;
        default:
          return false;
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OVERDUE: "bg-red-500/10 text-red-700 border-red-500/20",
      URGENT: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      WARNING: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      UPCOMING: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      COMPLETED: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      CANNOT_COMPUTE: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    };
    return colors[status] || colors.CANNOT_COMPUTE;
  };

  const toggleComplete = async (item: DeadlineItem) => {
    // In a real implementation, this would call an API to update the deadline
    // For now, we'll just update the local state
    if (deadlines) {
      const updatedItems = deadlines.items.map(i =>
        i.rule_id === item.rule_id ? { ...i, completed: !i.completed } : i
      );
      setDeadlines({ ...deadlines, items: updatedItems });
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDay = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDeadlinesForDate = (date: Date): DeadlineItem[] => {
    if (!deadlines) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return deadlines.items.filter(item => item.due_date === dateStr);
  };

  useEffect(() => {
    if (selectedCase) {
      fetchDeadlines();
    }
  }, [selectedCase]);

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="ml-4 text-muted-foreground">Loading deadlines...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const columns: { id: BoardColumn; title: string; titleHi: string; icon: React.ReactNode }[] = [
    { id: "overdue", title: "Overdue", titleHi: "देर से", icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
    { id: "this_week", title: "This Week", titleHi: "इस सप्ताह", icon: <Clock className="h-4 w-4 text-amber-500" /> },
    { id: "upcoming", title: "Upcoming", titleHi: "आगामी", icon: <Calendar className="h-4 w-4 text-blue-500" /> },
    { id: "filed", title: "Filed", titleHi: "दाखिल", icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Deadline Board
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track limitation periods and filing deadlines
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "board" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("board")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Board View
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      {deadlines && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-3">
            <p className="text-sm text-amber-900">
              {deadlines.disclaimer}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Board View */}
      {view === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(column => (
            <Card key={column.id} className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {column.icon}
                  {column.title}
                  <span className="text-muted-foreground">/ {column.titleHi}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {getColumnItems(column.id).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {getColumnItems(column.id).map(item => (
                  <div
                    key={item.rule_id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={`${getStatusBadge(item.status)} text-xs`}>
                        {item.status}
                      </Badge>
                      {item.due_date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.name_hi}</p>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>Rule:</strong> {item.rule_id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Days:</strong> {item.days_remaining !== null ? item.days_remaining : "N/A"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => toggleComplete(item)}
                    >
                      {item.completed ? "Mark Pending" : "Mark Complete"}
                    </Button>
                  </div>
                ))}
                {getColumnItems(column.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No items
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {view === "calendar" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((date, index) => {
                if (!date) {
                  return <div key={index} className="p-2" />;
                }
                
                const dayDeadlines = getDeadlinesForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`p-2 border rounded-lg min-h-[80px] ${
                      isToday ? "bg-primary/10 border-primary" : ""
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayDeadlines.map(item => (
                        <div
                          key={item.rule_id}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                            item.status === "OVERDUE" ? "bg-red-100 text-red-800" :
                            item.status === "URGENT" ? "bg-amber-100 text-amber-800" :
                            "bg-blue-100 text-blue-800"
                          }`}
                          title={`${item.name} (${item.name_hi})`}
                        >
                          {item.name.substring(0, 15)}...
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}