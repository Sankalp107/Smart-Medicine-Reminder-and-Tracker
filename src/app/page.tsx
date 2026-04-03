"use client";

import Link from "next/link";
import { Pill, ShieldCheck, Users, Bell, ArrowRight, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-primary" />
          <span className="font-bold text-base text-foreground">TelliMeds</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-grow flex items-center justify-center px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
            <Clock className="w-3 h-3" /> Smart medicine reminders
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Never miss a dose,<br />
            <span className="text-primary">stay on track.</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            TelliMeds helps you and your family manage medications with smart reminders, intake tracking, and caregiver alerts  all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2"
            >
              Start free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-foreground border border-border rounded-lg hover:bg-secondary transition-all text-center"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Bell, title: "Smart Reminders", desc: "Push notifications right when it's time." },
            { icon: ShieldCheck, title: "Intake Tracking", desc: "Log doses as taken or skipped in one tap." },
            { icon: Users, title: "Caregiver Alerts", desc: "Family gets notified if doses are missed." },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <f.icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2026 TelliMeds</p>
          <p className="text-xs text-muted-foreground">Built with care for every age.</p>
        </div>
      </footer>
    </main>
  );
}
