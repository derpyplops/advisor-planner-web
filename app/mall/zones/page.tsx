"use client";

import MallDashboardLayout from "@/components/mall/MallDashboardLayout";
import { useQuery, useMutation } from "@/lib/mall/use-api";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, MapPin, Trash2 } from "lucide-react";

type Zone = {
  id: number;
  name: string;
  type: string;
  floor?: string;
  areaSqm?: string;
  description?: string;
};

const zoneTypeLabels: Record<string, string> = {
  toilets: "Toilets",
  common_area: "Common Area",
  fnb_zone: "F&B Zone",
  retail_zone: "Retail Zone",
  parking: "Parking",
  lobby: "Lobby",
  office: "Office",
  other: "Other",
};

const zoneTypeColors: Record<string, string> = {
  toilets: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  common_area: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  fnb_zone: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  retail_zone: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  parking: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  lobby: "bg-green-500/10 text-green-400 border-green-500/20",
  office: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  other: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function AddZoneDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [floor, setFloor] = useState("");
  const [areaSqm, setAreaSqm] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useMutation("/api/mall/zones");

  const handleSubmit = async () => {
    try {
      await mutate({
        name,
        type,
        floor: floor || undefined,
        areaSqm: areaSqm || undefined,
        description: description || undefined,
      });
      toast.success("Zone added");
      setOpen(false);
      setName(""); setType(""); setFloor(""); setAreaSqm(""); setDescription("");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" /> Add Zone
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Zone">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Zone Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Level 1 Washroom A" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option value="">Select type</option>
              {Object.entries(zoneTypeLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Floor</label>
              <input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="e.g. L1" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Area (m2)</label>
              <input type="number" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} placeholder="e.g. 500" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" rows={2} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
          </div>
          <button
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            disabled={!name || !type || isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Adding..." : "Add Zone"}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default function Zones() {
  const { data: zoneList, isLoading, refetch } = useQuery<Zone[]>("/api/mall/zones");

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/mall/zones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Zone removed");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <MallDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Zone Management</h1>
            <p className="text-sm text-slate-400">Manage mall areas and zones</p>
          </div>
          <AddZoneDialog onSuccess={refetch} />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Loading zones...</div>
        ) : !zoneList?.length ? (
          <div className="blueprint-card bg-slate-800/80 border border-blue-500/20 rounded-lg">
            <div className="p-12 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-slate-400 opacity-20" />
              <p className="text-slate-400">No zones configured yet. Add your first zone.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zoneList.map((zone) => (
              <div key={zone.id} className="blueprint-card bg-slate-800/80 border border-blue-500/20 hover:border-blue-500/40 transition-colors rounded-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-100">{zone.name}</h3>
                      {zone.floor && <p className="text-xs text-slate-400">Floor: {zone.floor}</p>}
                    </div>
                    <button
                      className="h-8 w-8 inline-flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      onClick={() => handleDelete(zone.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded border ${zoneTypeColors[zone.type] ?? ""}`}>
                      {zoneTypeLabels[zone.type] ?? zone.type}
                    </span>
                    {zone.areaSqm && (
                      <span className="text-xs font-mono border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded">
                        {zone.areaSqm} m2
                      </span>
                    )}
                  </div>
                  {zone.description && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{zone.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MallDashboardLayout>
  );
}
