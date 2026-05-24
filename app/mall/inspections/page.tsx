"use client";

import MallDashboardLayout from "@/components/mall/MallDashboardLayout";
import { useQuery, useMutation } from "@/lib/mall/use-api";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Plus, ClipboardCheck, Trash2, Camera, ExternalLink } from "lucide-react";

type Zone = { id: number; name: string; type: string };

type Inspection = {
  id: number;
  zoneId: number;
  templateType: string;
  location: string;
  surfaceType: string;
  issueType: string;
  description?: string;
  photoUrl?: string;
  severityScore?: number;
  recommendedAction?: string;
  riskLevel?: string;
  status: string;
};

const surfaceTypes = ["stone", "glass", "metal", "timber", "tile", "concrete", "carpet", "other"] as const;
const issueTypes = ["crack", "stain", "wear", "water_damage", "mold", "discoloration", "scratch", "other"] as const;
const templateTypes = ["washroom", "high_touch", "tenant_zone", "general"] as const;
const actionTypes = ["clean", "repair", "replace", "monitor", "none"] as const;
const riskLevels = ["low", "medium", "high", "critical"] as const;

const riskColors: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusColors: Record<string, string> = {
  open: "bg-red-500/10 text-red-400 border-red-500/20",
  in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  resolved: "bg-green-500/10 text-green-400 border-green-500/20",
  deferred: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const inputClass = "w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50";
const selectClass = "w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50";
const labelClass = "text-sm font-medium text-slate-300";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function NewInspectionDialog({ onSuccess, zoneList }: { onSuccess: () => void; zoneList?: Zone[] }) {
  const [open, setOpen] = useState(false);
  const [zoneId, setZoneId] = useState("");
  const [templateType, setTemplateType] = useState("general");
  const [location, setLocation] = useState("");
  const [surfaceType, setSurfaceType] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [severityScore, setSeverityScore] = useState(5);
  const [recommendedAction, setRecommendedAction] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation("/api/mall/inspections");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const res = await fetch("/api/mall/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64, filename: file.name, contentType: file.type }),
          });
          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          setPhotoUrl(data.url);
          toast.success("Photo uploaded");
        } catch {
          toast.error("Upload failed");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await mutate({
        zoneId: parseInt(zoneId),
        templateType,
        location,
        surfaceType,
        issueType,
        description: description || undefined,
        photoUrl: photoUrl || undefined,
        severityScore,
        recommendedAction: recommendedAction || undefined,
        riskLevel: riskLevel || undefined,
      });
      toast.success("Inspection report created");
      setOpen(false);
      setZoneId(""); setLocation(""); setSurfaceType(""); setIssueType("");
      setDescription(""); setSeverityScore(5); setRecommendedAction("");
      setRiskLevel(""); setPhotoUrl(""); setTemplateType("general");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        <Plus className="h-4 w-4" /> New Inspection
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New Inspection Report">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Zone</label>
              <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className={selectClass}>
                <option value="">Select zone</option>
                {zoneList?.map((z) => (
                  <option key={z.id} value={z.id.toString()}>{z.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Template</label>
              <select value={templateType} onChange={(e) => setTemplateType(e.target.value)} className={selectClass}>
                {templateTypes.map((t) => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Specific Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Level 2 East Wing Corridor" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Surface Type</label>
              <select value={surfaceType} onChange={(e) => setSurfaceType(e.target.value)} className={selectClass}>
                <option value="">Surface</option>
                {surfaceTypes.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Issue Type</label>
              <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className={selectClass}>
                <option value="">Issue</option>
                {issueTypes.map((i) => (
                  <option key={i} value={i}>{i.replace("_", " ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail" rows={3} className={`${inputClass} resize-none`} />
          </div>

          {/* Photo Upload */}
          <div className="space-y-1.5">
            <label className={labelClass}>Photo Evidence</label>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-blue-500/30 text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                {uploading ? "Uploading..." : photoUrl ? "Change Photo" : "Upload Photo"}
              </button>
              {photoUrl && (
                <span className="text-xs text-green-400 border border-green-500/20 px-2 py-0.5 rounded">Photo attached</span>
              )}
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className={labelClass}>Severity Score: {severityScore}/10</label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={severityScore}
              onChange={(e) => setSeverityScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Minor</span><span>Critical</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Recommended Action</label>
              <select value={recommendedAction} onChange={(e) => setRecommendedAction(e.target.value)} className={selectClass}>
                <option value="">Action</option>
                {actionTypes.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Risk Level</label>
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} className={selectClass}>
                <option value="">Risk</option>
                {riskLevels.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            disabled={!zoneId || !location || !surfaceType || !issueType || isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Creating..." : "Submit Inspection Report"}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default function Inspections() {
  const { data: inspectionList, isLoading, refetch } = useQuery<Inspection[]>("/api/mall/inspections");
  const { data: zoneList } = useQuery<Zone[]>("/api/mall/zones");

  const getZoneName = (zoneId: number) => zoneList?.find((z) => z.id === zoneId)?.name ?? `Zone ${zoneId}`;

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/mall/inspections/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Inspection removed");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/mall/inspections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Status updated");
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Inspections</h1>
            <p className="text-sm text-slate-400">Damage & spoilage assessment reports</p>
          </div>
          <NewInspectionDialog onSuccess={refetch} zoneList={zoneList} />
        </div>

        <div className="blueprint-card bg-slate-800/80 border border-blue-500/20 rounded-lg">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading inspections...</div>
          ) : !inspectionList?.length ? (
            <div className="p-8 text-center text-slate-400">
              <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No inspection reports yet. Create your first report.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Location</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Zone</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Issue</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Surface</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Severity</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Risk</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Action</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Status</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Photo</th>
                    <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectionList.map((insp) => (
                    <tr key={insp.id} className="border-b border-slate-700/20">
                      <td className="px-4 py-3 font-medium text-sm text-slate-100 max-w-[150px] truncate">{insp.location}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{getZoneName(insp.zoneId)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded capitalize">
                          {insp.issueType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300 capitalize">{insp.surfaceType}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-sm font-bold ${
                          (insp.severityScore ?? 0) >= 8 ? "text-red-400" :
                          (insp.severityScore ?? 0) >= 5 ? "text-yellow-400" : "text-green-400"
                        }`}>
                          {insp.severityScore ?? "-"}/10
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {insp.riskLevel ? (
                          <span className={`text-xs px-2 py-0.5 rounded border ${riskColors[insp.riskLevel] ?? ""}`}>
                            {insp.riskLevel}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300 capitalize">{insp.recommendedAction?.replace("_", " ") ?? "-"}</td>
                      <td className="px-4 py-3">
                        <select
                          value={insp.status}
                          onChange={(e) => handleUpdateStatus(insp.id, e.target.value)}
                          className="h-7 text-xs bg-slate-900 border border-slate-700/30 rounded px-1 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="deferred">Deferred</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {insp.photoUrl ? (
                          <a href={insp.photoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="h-8 w-8 inline-flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg"
                          onClick={() => handleDelete(insp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MallDashboardLayout>
  );
}
