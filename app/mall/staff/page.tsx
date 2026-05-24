"use client";

import MallDashboardLayout from "@/components/mall/MallDashboardLayout";
import { useQuery, useMutation } from "@/lib/mall/use-api";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Users, Calendar, Trash2, UserPlus } from "lucide-react";

type Staff = {
  id: number;
  name: string;
  employeeId: string;
  role: string;
  status: string;
  phone?: string;
  email?: string;
};

type Zone = {
  id: number;
  name: string;
  type: string;
};

type Schedule = {
  id: number;
  staffId: number;
  zoneId: number;
  shiftType: string;
  taskType: string;
  date: string | number;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
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

function AddStaffDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation("/api/mall/staff");

  const handleSubmit = async () => {
    try {
      await mutate({ name, employeeId, role, phone: phone || undefined, email: email || undefined });
      toast.success("Staff member added");
      setOpen(false);
      setName(""); setEmployeeId(""); setRole(""); setPhone(""); setEmail("");
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
        <UserPlus className="h-4 w-4" /> Add Staff
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Staff Member">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Employee ID</label>
            <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="e.g. EMP-001" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option value="">Select role</option>
              <option value="cleaner">Cleaner</option>
              <option value="supervisor">Supervisor</option>
              <option value="technician">Technician</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>
          <button
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            disabled={!name || !employeeId || !role || isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Adding..." : "Add Staff Member"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function AddScheduleDialog({ onSuccess, staffList, zoneList }: { onSuccess: () => void; staffList?: Staff[]; zoneList?: Zone[] }) {
  const [open, setOpen] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [taskType, setTaskType] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate, isPending } = useMutation("/api/mall/schedules");

  const handleSubmit = async () => {
    try {
      await mutate({
        staffId: parseInt(staffId),
        zoneId: parseInt(zoneId),
        shiftType,
        taskType,
        date: new Date(date).getTime(),
        startTime,
        endTime,
        notes: notes || undefined,
      });
      toast.success("Schedule created");
      setOpen(false);
      setStaffId(""); setZoneId(""); setShiftType(""); setTaskType("");
      setDate(""); setStartTime(""); setEndTime(""); setNotes("");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-blue-500/30 text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors"
      >
        <Calendar className="h-4 w-4" /> New Schedule
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Schedule">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Staff Member</label>
            <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option value="">Select staff</option>
              {staffList?.map((s) => (
                <option key={s.id} value={s.id.toString()}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Zone</label>
            <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option value="">Select zone</option>
              {zoneList?.map((z) => (
                <option key={z.id} value={z.id.toString()}>{z.name} ({z.type.replace("_", " ")})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Shift Type</label>
              <select value={shiftType} onChange={(e) => setShiftType(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="">Shift</option>
                <option value="day">Day</option>
                <option value="night">Night</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Task Type</label>
              <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="">Task</option>
                <option value="routine">Routine</option>
                <option value="deep_cleaning">Deep Cleaning</option>
                <option value="event_prep">Event Prep</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <button
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            disabled={!staffId || !zoneId || !shiftType || !taskType || !date || !startTime || !endTime || isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Creating..." : "Create Schedule"}
          </button>
        </div>
      </Modal>
    </>
  );
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  on_leave: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const scheduleStatusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function StaffDeployment() {
  const [activeTab, setActiveTab] = useState<"staff" | "schedules">("staff");
  const { data: staffList, isLoading: staffLoading, refetch: refetchStaff } = useQuery<Staff[]>("/api/mall/staff");
  const { data: scheduleList, isLoading: schedLoading, refetch: refetchSchedules } = useQuery<Schedule[]>("/api/mall/schedules");
  const { data: zoneList } = useQuery<Zone[]>("/api/mall/zones");

  const getZoneName = (zoneId: number) => zoneList?.find((z) => z.id === zoneId)?.name ?? `Zone ${zoneId}`;
  const getStaffName = (staffId: number) => staffList?.find((s) => s.id === staffId)?.name ?? `Staff ${staffId}`;

  const refreshAll = () => {
    refetchStaff();
    refetchSchedules();
  };

  const handleDeleteStaff = async (id: number) => {
    try {
      const res = await fetch(`/api/mall/staff/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Staff removed");
      refetchStaff();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      const res = await fetch(`/api/mall/schedules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Schedule removed");
      refetchSchedules();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleUpdateScheduleStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/mall/schedules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Status updated");
      refetchSchedules();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <MallDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Staff Deployment</h1>
            <p className="text-sm text-slate-400">Manage staff and shift schedules</p>
          </div>
          <div className="flex gap-2">
            <AddStaffDialog onSuccess={refreshAll} />
            <AddScheduleDialog onSuccess={refreshAll} staffList={staffList} zoneList={zoneList} />
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-4">
          <div className="flex gap-1 bg-slate-800 border border-slate-700/50 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab("staff")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "staff" ? "bg-blue-600/10 text-blue-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="h-4 w-4" /> Staff ({staffList?.length ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("schedules")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "schedules" ? "bg-blue-600/10 text-blue-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="h-4 w-4" /> Schedules ({scheduleList?.length ?? 0})
            </button>
          </div>

          {activeTab === "staff" && (
            <div className="blueprint-card bg-slate-800/80 border border-blue-500/20 rounded-lg">
              {staffLoading ? (
                <div className="p-8 text-center text-slate-400">Loading staff...</div>
              ) : !staffList?.length ? (
                <div className="p-8 text-center text-slate-400">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No staff members yet. Add your first team member.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Name</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">ID</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Role</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Status</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Contact</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3 w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList.map((s) => (
                        <tr key={s.id} className="border-b border-slate-700/20">
                          <td className="px-4 py-3 font-medium text-sm text-slate-100">{s.name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-400">{s.employeeId}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded capitalize">{s.role}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[s.status] ?? ""}`}>
                              {s.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">{s.phone || s.email || "-"}</td>
                          <td className="px-4 py-3">
                            <button
                              className="h-8 w-8 inline-flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              onClick={() => handleDeleteStaff(s.id)}
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
          )}

          {activeTab === "schedules" && (
            <div className="blueprint-card bg-slate-800/80 border border-blue-500/20 rounded-lg">
              {schedLoading ? (
                <div className="p-8 text-center text-slate-400">Loading schedules...</div>
              ) : !scheduleList?.length ? (
                <div className="p-8 text-center text-slate-400">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No schedules yet. Create your first shift assignment.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Staff</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Zone</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Date</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Time</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Shift</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Task</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Status</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3 w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleList.map((sch) => (
                        <tr key={sch.id} className="border-b border-slate-700/20">
                          <td className="px-4 py-3 font-medium text-sm text-slate-100">{getStaffName(sch.staffId)}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{getZoneName(sch.zoneId)}</td>
                          <td className="px-4 py-3 text-xs text-slate-300">
                            {new Date(sch.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-300">{sch.startTime}-{sch.endTime}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded capitalize">{sch.shiftType}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-300 capitalize">{sch.taskType.replace("_", " ")}</td>
                          <td className="px-4 py-3">
                            <select
                              value={sch.status}
                              onChange={(e) => handleUpdateScheduleStatus(sch.id, e.target.value)}
                              className="h-7 text-xs bg-slate-900 border border-slate-700/30 rounded px-1 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="h-8 w-8 inline-flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              onClick={() => handleDeleteSchedule(sch.id)}
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
          )}
        </div>
      </div>
    </MallDashboardLayout>
  );
}
