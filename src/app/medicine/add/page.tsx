"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AddMedicinePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [instructions, setInstructions] = useState("no-preference");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const instructionOptions = [
    { value: "before-food", label: "Before food", emoji: "🍽️" },
    { value: "after-food", label: "After food", emoji: "🥗" },
    { value: "with-food", label: "With food", emoji: "🍛" },
    { value: "empty-stomach", label: "Empty stomach", emoji: "⏳" },
    { value: "with-water", label: "With water", emoji: "💧" },
    { value: "before-sleep", label: "Before sleep", emoji: "🌙" },
    { value: "no-preference", label: "No preference", emoji: "➖" },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("medicines").insert([
      { user_id: user.id, name, dosage, time, frequency, instructions }
    ]);

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5 p-4 md:p-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <div>
        <h1 className="text-lg font-bold text-foreground">Add Medicine</h1>
        <p className="text-xs text-muted-foreground mt-1">Enter prescription details below.</p>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-5 space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Medicine Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lisinopril"
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Dosage</label>
            <input
              type="text"
              required
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 10mg"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="daily">Once daily</option>
            <option value="twice">Twice daily</option>
            <option value="thrice">Three times daily</option>
            <option value="weekly">Weekly</option>
            <option value="as-needed">As needed</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Instructions</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {instructionOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setInstructions(opt.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5
                  ${instructions === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-input hover:border-primary/40"}`}
              >
                <span>{opt.emoji}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border">
          <Link href="/dashboard" className="flex-1 py-2 text-center text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-lg transition-all">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save</>}
          </button>
        </div>
      </form>
    </div>
  );
}
