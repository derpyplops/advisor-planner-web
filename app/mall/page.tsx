"use client";

import MallDashboardLayout from "@/components/mall/MallDashboardLayout";
import { useQuery } from "@/lib/mall/use-api";
import { useRouter } from "next/navigation";
import {
  Users,
  MapPin,
  AlertTriangle,
  Package,
  ClipboardCheck,
  ShoppingCart,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  onClick,
}: {
  title: string;
  value: number | string;
  icon: any;
  description?: string;
  variant?: "default" | "warning" | "danger";
  onClick?: () => void;
}) {
  const borderColor =
    variant === "danger"
      ? "border-red-500/30"
      : variant === "warning"
        ? "border-yellow-500/30"
        : "border-blue-500/20";
  const iconColor =
    variant === "danger"
      ? "text-red-400"
      : variant === "warning"
        ? "text-yellow-500"
        : "text-blue-400";

  return (
    <div
      className={`blueprint-card bg-slate-800/80 backdrop-blur border ${borderColor} rounded-lg ${onClick ? "cursor-pointer hover:bg-slate-700/30 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-slate-100">{value}</p>
            {description && (
              <p className="text-xs text-slate-400">{description}</p>
            )}
          </div>
          <div className="p-2 rounded-lg bg-blue-600/5 border border-blue-500/10">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  icon: Icon,
  path,
}: {
  title: string;
  description: string;
  icon: any;
  path: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(path)}
      className="flex items-center gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/30 hover:border-blue-500/30 transition-all group text-left w-full"
    >
      <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 shrink-0">
        <Icon className="h-5 w-5 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-slate-100">{title}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors shrink-0" />
    </button>
  );
}

function ProductivityBenchmarks() {
  const benchmarks = [
    { task: "Manual Mopping", rate: "150-250 m2/hr", icon: "M" },
    { task: "Ride-on Scrubber", rate: "2,000-4,000 m2/hr", icon: "R" },
    { task: "Toilet Turnaround", rate: "30-40 min (full set)", icon: "T" },
  ];

  return (
    <div className="blueprint-card bg-slate-800/80 backdrop-blur border border-blue-500/20 rounded-lg">
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Productivity Benchmarks
        </h3>
      </div>
      <div className="px-4 pb-4 space-y-3">
        {benchmarks.map((b) => (
          <div
            key={b.task}
            className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-xs font-mono text-blue-400">{b.icon}</span>
              <span className="text-sm text-slate-100">{b.task}</span>
            </div>
            <span className="text-xs font-mono border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded">
              {b.rate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type DashboardStats = {
  staffCount: number;
  zoneCount: number;
  openInspections: number;
  lowStockCount: number;
  pendingOrders: number;
  scheduledToday: number;
  recentInspections: Array<{
    id: number;
    location: string;
    issueType: string;
    surfaceType: string;
    status: string;
  }>;
};

export default function MallDashboard() {
  const router = useRouter();
  const { data: stats, isLoading } = useQuery<DashboardStats>("/api/mall/dashboard/stats");

  const recentInspections = stats?.recentInspections ?? [];

  return (
    <MallDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            Operations Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Retail Mall Operations & Asset Intelligence System
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-4 md:p-6">
                <div className="h-4 w-20 mb-2 bg-slate-700 rounded animate-pulse" />
                <div className="h-8 w-12 bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <StatCard
              title="Active Staff"
              value={stats?.staffCount ?? 0}
              icon={Users}
              description="Currently on duty"
              onClick={() => router.push("/mall/staff")}
            />
            <StatCard
              title="Zones"
              value={stats?.zoneCount ?? 0}
              icon={MapPin}
              description="Managed areas"
              onClick={() => router.push("/mall/zones")}
            />
            <StatCard
              title="Open Inspections"
              value={stats?.openInspections ?? 0}
              icon={ClipboardCheck}
              description="Pending review"
              variant={
                (stats?.openInspections ?? 0) > 5
                  ? "danger"
                  : (stats?.openInspections ?? 0) > 0
                    ? "warning"
                    : "default"
              }
              onClick={() => router.push("/mall/inspections")}
            />
            <StatCard
              title="Low Stock"
              value={stats?.lowStockCount ?? 0}
              icon={Package}
              description="Items below minimum"
              variant={
                (stats?.lowStockCount ?? 0) > 0 ? "warning" : "default"
              }
              onClick={() => router.push("/mall/procurement")}
            />
            <StatCard
              title="Pending Orders"
              value={stats?.pendingOrders ?? 0}
              icon={ShoppingCart}
              description="Awaiting approval"
              onClick={() => router.push("/mall/procurement")}
            />
            <StatCard
              title="Scheduled Today"
              value={stats?.scheduledToday ?? 0}
              icon={Clock}
              description="Shifts planned"
              onClick={() => router.push("/mall/staff")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Quick Actions */}
          <div className="blueprint-card bg-slate-800/80 backdrop-blur border border-blue-500/20 rounded-lg">
            <div className="px-4 pt-4 pb-3">
              <h3 className="text-sm font-semibold text-blue-400">Quick Actions</h3>
            </div>
            <div className="px-4 pb-4 space-y-2">
              <QuickAction
                title="Schedule Staff"
                description="Create new shift assignments"
                icon={Users}
                path="/mall/staff"
              />
              <QuickAction
                title="New Inspection"
                description="Report damage or spoilage"
                icon={ClipboardCheck}
                path="/mall/inspections"
              />
              <QuickAction
                title="Create Purchase Order"
                description="Order supplies and materials"
                icon={ShoppingCart}
                path="/mall/procurement"
              />
              <QuickAction
                title="Ask AI Assistant"
                description="Get operational advice"
                icon={AlertTriangle}
                path="/mall/ai-assistant"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <ProductivityBenchmarks />

            {/* Recent Inspections */}
            <div className="blueprint-card bg-slate-800/80 backdrop-blur border border-blue-500/20 rounded-lg">
              <div className="px-4 pt-4 pb-3">
                <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Recent Inspections
                </h3>
              </div>
              <div className="px-4 pb-4">
                {recentInspections.length > 0 ? (
                  <div className="space-y-2">
                    {recentInspections.map((insp) => (
                      <div
                        key={insp.id}
                        className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-100 truncate">
                            {insp.location}
                          </p>
                          <p className="text-xs text-slate-400">
                            {insp.issueType.replace("_", " ")} — {insp.surfaceType}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded border shrink-0 ${
                            insp.status === "open"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : insp.status === "resolved"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                          }`}
                        >
                          {insp.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No inspections recorded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MallDashboardLayout>
  );
}
