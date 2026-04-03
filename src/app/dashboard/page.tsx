"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Check, X, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  instructions?: string;
}

const instructionLabels: Record<string, string> = {
  "before-food": "🍽️ Before food",
  "after-food": "🥗 After food",
  "with-food": "🍛 With food",
  "empty-stomach": "⏳ Empty stomach",
  "with-water": "💧 With water",
  "before-sleep": "🌙 Before sleep",
};

interface DoseLog {
  id: string;
  medicine_id: string;
  status: string;
  scheduled_for: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [loadingMeds, setLoadingMeds] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoadingMeds(true);
    const [medsRes, logsRes] = await Promise.all([
      supabase.from("medicines").select("*").eq("user_id", user!.id).order("time"),
      supabase.from("dose_logs").select("*").eq("user_id", user!.id).eq("scheduled_for", today),
    ]);
    setMedicines(medsRes.data || []);
    setDoseLogs(logsRes.data || []);
    setLoadingMeds(false);
  };

  const markDose = async (medicineId: string, status: "taken" | "skipped") => {
    const { data } = await supabase.from("dose_logs").insert([
      { user_id: user!.id, medicine_id: medicineId, status, scheduled_for: today }
    ]).select().single();
    if (data) setDoseLogs([...doseLogs, data]);
  };

  const getStatus = (medId: string) => {
    const log = doseLogs.find(l => l.medicine_id === medId);
    return log?.status || "pending";
  };

  const takenCount = doseLogs.filter(l => l.status === "taken").length;
  const totalMeds = medicines.length;
  const adherence = totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Today&apos;s Schedule</h1>
          <p className="text-xs text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        <Link
          href="/medicine/add"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add medicine
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total</p>
          <p className="text-xl font-bold text-foreground mt-1">{totalMeds}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Taken</p>
          <p className="text-xl font-bold text-success mt-1">{takenCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Adherence</p>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-xl font-bold text-foreground">{adherence}%</p>
            <TrendingUp className="w-3.5 h-3.5 text-success" />
          </div>
        </div>
      </div>

      {/* Medicine list */}
      {loadingMeds ? (
        <div className="text-center py-10 text-xs text-muted-foreground">Loading your medicines...</div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No medicines yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first medication to get started.</p>
          <Link
            href="/medicine/add"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add medicine
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {medicines.map((med) => {
            const status = getStatus(med.id);
            return (
              <div
                key={med.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all
                  ${status === "taken"
                    ? "bg-success/5 border-success/20"
                    : status === "skipped"
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-card border-border hover:border-primary/30"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    status === "taken" ? "bg-success/10 text-success" :
                    status === "skipped" ? "bg-destructive/10 text-destructive" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{med.name}</span>
                      <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[10px] font-bold uppercase">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {med.time} · {med.frequency}
                      {med.instructions && med.instructions !== "no-preference" && (
                        <span className="ml-1.5 text-primary font-medium">{instructionLabels[med.instructions]}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {status === "pending" ? (
                    <>
                      <button
                        onClick={() => markDose(med.id, "taken")}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-success text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-success/90 transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" /> Taken
                      </button>
                      <button
                        onClick={() => markDose(med.id, "skipped")}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-secondary/80 transition-all active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" /> Skip
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                      status === "taken" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                    }`}>
                      {status === "taken" ? "✓ Taken" : "Skipped"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
