"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Clock, Globe, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { requestNotificationPermission } from "@/lib/firebase";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailReminders, setEmailReminders] = useState(true);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [savedCaregiver, setSavedCaregiver] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    setLoading(true);
    const token = await requestNotificationPermission();
    setLoading(false);
    if (token) {
      setNotificationsEnabled(true);
      // TODO: Save FCM token to Supabase for this user
      console.log("FCM Token:", token);
    }
  };

  const handleSaveCaregiver = () => {
    if (caregiverEmail) {
      // TODO: Save to Supabase
      setSavedCaregiver(true);
      setTimeout(() => setSavedCaregiver(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-lg font-bold text-foreground">Settings</h1>

      {/* Account */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Email</span>
          <span className="text-sm text-muted-foreground">{user?.email}</span>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notifications</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {notificationsEnabled ? <Bell className="w-4 h-4 text-primary" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
            <span className="text-sm text-foreground">Push notifications</span>
          </div>
          <button
            onClick={toggleNotifications}
            disabled={loading}
            className={`relative w-10 h-5 rounded-full transition-colors ${notificationsEnabled ? "bg-primary" : "bg-secondary"}`}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
            ) : (
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notificationsEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Email reminders</span>
          </div>
          <button
            onClick={() => setEmailReminders(!emailReminders)}
            className={`relative w-10 h-5 rounded-full transition-colors ${emailReminders ? "bg-primary" : "bg-secondary"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${emailReminders ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferences</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Time format</span>
          </div>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            <button
              onClick={() => setTimeFormat("12h")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${timeFormat === "12h" ? "bg-primary text-primary-foreground" : "text-secondary-foreground"}`}
            >12h</button>
            <button
              onClick={() => setTimeFormat("24h")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${timeFormat === "24h" ? "bg-primary text-primary-foreground" : "text-secondary-foreground"}`}
            >24h</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Language</span>
          </div>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">English</span>
        </div>
      </div>

      {/* Caregiver */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Caregiver</h2>
        <p className="text-xs text-muted-foreground">Get alerts sent to a family member if you miss doses repeatedly.</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={caregiverEmail}
            onChange={(e) => setCaregiverEmail(e.target.value)}
            placeholder="caregiver@email.com"
            className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSaveCaregiver}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all"
          >
            {savedCaregiver ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
