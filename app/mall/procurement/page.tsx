"use client";

import MallDashboardLayout from "@/components/mall/MallDashboardLayout";
import { useQuery, useMutation } from "@/lib/mall/use-api";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Package, ShoppingCart, Store, Trash2, AlertTriangle } from "lucide-react";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  unit: string;
  currentStock: string;
  minStock: string;
  unitPrice: string;
  description?: string;
};

type Vendor = {
  id: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  category: string;
  notes?: string;
};

type PurchaseOrder = {
  id: number;
  orderNumber: string;
  vendorId: number;
  totalAmount: string;
  status: string;
  createdAt: string;
};

function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative bg-slate-800 border border-slate-700 rounded-lg shadow-xl ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const inputClass = "w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50";
const selectClass = "w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50";
const labelClass = "text-sm font-medium text-slate-300";
const btnPrimary = "w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors";

function AddInventoryDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useMutation("/api/mall/inventory");

  const handleSubmit = async () => {
    try {
      await mutate({
        name, category, unit,
        currentStock: currentStock || undefined,
        minStock: minStock || undefined,
        unitPrice: unitPrice || undefined,
        description: description || undefined,
      });
      toast.success("Inventory item added");
      setOpen(false);
      setName(""); setCategory(""); setUnit(""); setCurrentStock(""); setMinStock(""); setUnitPrice(""); setDescription("");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        <Plus className="h-4 w-4" /> Add Item
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Inventory Item">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Item Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Floor Cleaner Solution" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                <option value="">Category</option>
                <option value="chemicals">Chemicals</option>
                <option value="tools">Tools</option>
                <option value="consumables">Consumables</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Unit</label>
              <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. liters, pcs" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Current Stock</label>
              <input type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} placeholder="0" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Min Stock</label>
              <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="0" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Unit Price</label>
              <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" rows={2} className={`${inputClass} resize-none`} />
          </div>
          <button className={btnPrimary} disabled={!name || !category || !unit || isPending} onClick={handleSubmit}>
            {isPending ? "Adding..." : "Add Item"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function AddVendorDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate, isPending } = useMutation("/api/mall/vendors");

  const handleSubmit = async () => {
    try {
      await mutate({
        name, category,
        contactPerson: contactPerson || undefined,
        phone: phone || undefined,
        email: email || undefined,
        notes: notes || undefined,
      });
      toast.success("Vendor added");
      setOpen(false);
      setName(""); setContactPerson(""); setPhone(""); setEmail(""); setCategory(""); setNotes("");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-blue-500/30 text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors">
        <Store className="h-4 w-4" /> Add Vendor
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Vendor">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Company Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vendor name" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Contact Person</label>
            <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Contact name" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              <option value="">Category</option>
              <option value="chemicals">Chemicals</option>
              <option value="tools">Tools</option>
              <option value="consumables">Consumables</option>
              <option value="equipment">Equipment</option>
              <option value="services">Services</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" rows={2} className={`${inputClass} resize-none`} />
          </div>
          <button className={btnPrimary} disabled={!name || !category || isPending} onClick={handleSubmit}>
            {isPending ? "Adding..." : "Add Vendor"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function CreatePODialog({ onSuccess, vendorList, inventoryList }: { onSuccess: () => void; vendorList?: Vendor[]; inventoryList?: InventoryItem[] }) {
  const [open, setOpen] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ inventoryId: "", quantity: "", unitPrice: "" }]);

  const { mutate, isPending } = useMutation("/api/mall/purchase-orders");

  const addItem = () => setItems([...items, { inventoryId: "", quantity: "", unitPrice: "" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: string) => {
    const updated = [...items];
    (updated[idx] as any)[field] = value;
    setItems(updated);
  };

  const validItems = items.filter(i => i.inventoryId && i.quantity && i.unitPrice);

  const handleSubmit = async () => {
    try {
      const result = await mutate({
        vendorId: parseInt(vendorId),
        notes: notes || undefined,
        items: validItems.map(i => ({
          inventoryId: parseInt(i.inventoryId),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      });
      toast.success(`Purchase order ${result?.orderNumber || ""} created`);
      setOpen(false);
      setVendorId(""); setNotes(""); setItems([{ inventoryId: "", quantity: "", unitPrice: "" }]);
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-blue-500/30 text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors">
        <ShoppingCart className="h-4 w-4" /> New Order
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Purchase Order" maxWidth="max-w-lg">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Vendor</label>
            <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className={selectClass}>
              <option value="">Select vendor</option>
              {vendorList?.map((v) => (
                <option key={v.id} value={v.id.toString()}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className={labelClass}>Order Items</label>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <select value={item.inventoryId} onChange={(e) => updateItem(idx, "inventoryId", e.target.value)} className={`${selectClass} text-xs`}>
                    <option value="">Item</option>
                    {inventoryList?.map((inv) => (
                      <option key={inv.id} value={inv.id.toString()}>{inv.name}</option>
                    ))}
                  </select>
                </div>
                <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} className={`${inputClass} w-20`} />
                <input type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", e.target.value)} className={`${inputClass} w-24`} />
                {items.length > 1 && (
                  <button className="h-9 w-9 shrink-0 inline-flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg" onClick={() => removeItem(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addItem} className="inline-flex items-center gap-1 text-xs border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-600/10 transition-colors">
              <Plus className="h-3 w-3" /> Add Item
            </button>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" rows={2} className={`${inputClass} resize-none`} />
          </div>
          <button className={btnPrimary} disabled={!vendorId || validItems.length === 0 || isPending} onClick={handleSubmit}>
            {isPending ? "Creating..." : "Create Purchase Order"}
          </button>
        </div>
      </Modal>
    </>
  );
}

const orderStatusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function Procurement() {
  const [activeTab, setActiveTab] = useState<"inventory" | "vendors" | "orders">("inventory");
  const { data: inventoryList, isLoading: invLoading, refetch: refetchInventory } = useQuery<InventoryItem[]>("/api/mall/inventory");
  const { data: vendorList, refetch: refetchVendors } = useQuery<Vendor[]>("/api/mall/vendors");
  const { data: orderList, refetch: refetchOrders } = useQuery<PurchaseOrder[]>("/api/mall/purchase-orders");
  const { data: lowStock } = useQuery<InventoryItem[]>("/api/mall/inventory/low-stock");

  const getVendorName = (id: number) => vendorList?.find((v) => v.id === id)?.name ?? `Vendor ${id}`;

  const refreshAll = () => {
    refetchInventory();
    refetchVendors();
    refetchOrders();
  };

  const handleDeleteInventory = async (id: number) => {
    try {
      const res = await fetch(`/api/mall/inventory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Item removed");
      refetchInventory();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteVendor = async (id: number) => {
    try {
      const res = await fetch(`/api/mall/vendors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Vendor removed");
      refetchVendors();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/mall/purchase-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Order updated");
      refetchOrders();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <MallDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Procurement</h1>
            <p className="text-sm text-slate-400">Inventory, vendors, and purchase orders</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <AddInventoryDialog onSuccess={refreshAll} />
            <AddVendorDialog onSuccess={refreshAll} />
            <CreatePODialog onSuccess={refreshAll} vendorList={vendorList} inventoryList={inventoryList} />
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStock && lowStock.length > 0 && (
          <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Low Stock Alert</p>
              <p className="text-xs text-slate-400 mt-1">
                {lowStock.map(i => i.name).join(", ")} — below minimum stock levels
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="space-y-4">
          <div className="flex gap-1 bg-slate-800 border border-slate-700/50 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "inventory" ? "bg-blue-600/10 text-blue-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Package className="h-4 w-4" /> Inventory ({inventoryList?.length ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("vendors")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "vendors" ? "bg-blue-600/10 text-blue-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Store className="h-4 w-4" /> Vendors ({vendorList?.length ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "orders" ? "bg-blue-600/10 text-blue-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShoppingCart className="h-4 w-4" /> Orders ({orderList?.length ?? 0})
            </button>
          </div>

          {activeTab === "inventory" && (
            <div className="blueprint-card bg-slate-800/80 border border-blue-500/20 rounded-lg">
              {invLoading ? (
                <div className="p-8 text-center text-slate-400">Loading...</div>
              ) : !inventoryList?.length ? (
                <div className="p-8 text-center text-slate-400">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No inventory items yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Item</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Category</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Stock</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Min</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Price</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3 w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryList.map((item) => {
                        const isLow = parseFloat(item.currentStock) <= parseFloat(item.minStock);
                        return (
                          <tr key={item.id} className={`border-b border-slate-700/20 ${isLow ? "bg-yellow-500/5" : ""}`}>
                            <td className="px-4 py-3 font-medium text-sm text-slate-100">{item.name}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded capitalize">{item.category}</span>
                            </td>
                            <td className={`px-4 py-3 font-mono text-sm ${isLow ? "text-yellow-400" : "text-slate-100"}`}>
                              {item.currentStock} {item.unit}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-400">{item.minStock}</td>
                            <td className="px-4 py-3 font-mono text-sm text-slate-100">${item.unitPrice}</td>
                            <td className="px-4 py-3">
                              <button className="h-8 w-8 inline-flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg" onClick={() => handleDeleteInventory(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "vendors" && (
            <div className="blueprint-card bg-slate-800/80 border border-blue-500/20 rounded-lg">
              {!vendorList?.length ? (
                <div className="p-8 text-center text-slate-400">
                  <Store className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No vendors yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Company</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Contact</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Category</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Phone</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3 w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorList.map((v) => (
                        <tr key={v.id} className="border-b border-slate-700/20">
                          <td className="px-4 py-3 font-medium text-sm text-slate-100">{v.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-400">{v.contactPerson || "-"}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded capitalize">{v.category}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">{v.phone || v.email || "-"}</td>
                          <td className="px-4 py-3">
                            <button className="h-8 w-8 inline-flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg" onClick={() => handleDeleteVendor(v.id)}>
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

          {activeTab === "orders" && (
            <div className="blueprint-card bg-slate-800/80 border border-blue-500/20 rounded-lg">
              {!orderList?.length ? (
                <div className="p-8 text-center text-slate-400">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No purchase orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Order #</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Vendor</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Amount</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Status</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3">Date</th>
                        <th className="text-left text-blue-400 text-xs uppercase font-medium px-4 py-3 w-32">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.map((order) => (
                        <tr key={order.id} className="border-b border-slate-700/20">
                          <td className="px-4 py-3 font-mono text-xs text-slate-300">{order.orderNumber}</td>
                          <td className="px-4 py-3 font-medium text-sm text-slate-100">{getVendorName(order.vendorId)}</td>
                          <td className="px-4 py-3 font-mono text-sm text-slate-100">${order.totalAmount}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded border ${orderStatusColors[order.status] ?? ""}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="h-7 text-xs bg-slate-900 border border-slate-700/30 rounded px-1 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                            >
                              <option value="draft">Draft</option>
                              <option value="submitted">Submitted</option>
                              <option value="approved">Approved</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
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
