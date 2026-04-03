"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Pill, LayoutDashboard, Calendar, Settings, LogOut, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground text-sm">
          <Pill className="w-4 h-4 animate-spin" /> Loading...
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Today", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Prescriptions", href: "/dashboard/prescriptions", icon: Upload },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="w-full md:w-56 bg-card border-b md:border-r md:border-b-0 border-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Pill className="text-primary w-4 h-4" />
            <span className="font-bold text-sm text-foreground">TelliMeds</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex flex-row md:flex-col gap-1 p-2 overflow-x-auto md:overflow-visible hide-scrollbar flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs font-medium min-w-[max-content]
                ${pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* User info + Sign Out (desktop) */}
        <div className="hidden md:flex flex-col gap-2 p-3 border-t border-border">
          <div className="text-xs text-muted-foreground truncate px-1">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
