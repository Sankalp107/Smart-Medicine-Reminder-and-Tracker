"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from "date-fns";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
}

interface DoseLog {
  medicine_id: string;
  status: string;
  scheduled_for: string;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, currentMonth]);

  const loadData = async () => {
    const start = format(monthStart, "yyyy-MM-dd");
    const end = format(monthEnd, "yyyy-MM-dd");

    const [medsRes, logsRes] = await Promise.all([
      supabase.from("medicines").select("*").eq("user_id", user!.id),
      supabase.from("dose_logs").select("*").eq("user_id", user!.id).gte("scheduled_for", start).lte("scheduled_for", end),
    ]);
    setMedicines(medsRes.data || []);
    setDoseLogs(logsRes.data || []);
  };

  const getLogsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return doseLogs.filter(l => l.scheduled_for === dateStr);
  };

  const getDayStatus = (date: Date) => {
    const logs = getLogsForDate(date);
    if (logs.length === 0) return "none";
    const allTaken = logs.every(l => l.status === "taken");
    const hasMissed = logs.some(l => l.status === "skipped");
    if (allTaken) return "complete";
    if (hasMissed) return "partial";
    return "partial";
  };

  const selectedLogs = getLogsForDate(selectedDate);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-lg font-bold text-foreground">Calendar</h1>

      {/* Calendar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <h2 className="text-sm font-bold text-foreground">{format(currentMonth, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
          ))}

          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map(day => {
            const status = getDayStatus(day);
            const selected = isSameDay(day, selectedDate);
            const todayClass = isToday(day);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all relative
                  ${selected ? "bg-primary text-primary-foreground" : todayClass ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
              >
                {format(day, "d")}
                {status !== "none" && !selected && (
                  <div className={`absolute bottom-1 w-1 h-1 rounded-full
                    ${status === "complete" ? "bg-success" : "bg-warning"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date details */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          {format(selectedDate, "EEEE, MMMM d")}
        </h3>
        {selectedLogs.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No activity recorded for this date.</p>
        ) : (
          <div className="space-y-2">
            {selectedLogs.map((log, i) => {
              const med = medicines.find(m => m.id === log.medicine_id);
              return (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    log.status === "taken" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {log.status === "taken" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{med?.name || "Unknown"}</p>
                    <p className="text-[10px] text-muted-foreground">{med?.dosage} · {log.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
