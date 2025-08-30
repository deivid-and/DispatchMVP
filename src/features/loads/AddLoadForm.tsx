import React, { useEffect, useMemo, useState } from "react";
import { createLoad } from "../../lib/api";

type Props = {
  defaultCompanyId: string;
  onSuccess: () => void;
  onCancel: () => void;
  defaultPickupDateIso?: string; // YYYY-MM-DD (from board week)
  defaultDeliveryDateIso?: string; // YYYY-MM-DD (from board week)
};

export default function AddLoadForm({ defaultCompanyId, onSuccess, onCancel, defaultPickupDateIso, defaultDeliveryDateIso }: Props) {
  const [form, setForm] = useState({
    companyId: defaultCompanyId,
    dispatcherId: "",
    driverId: "",
    pickupCity: "", pickupState: "",
    deliveryCity: "", deliveryState: "",
    pickupDate: "",
    deliveryDate: "",
    pickupWindowStart: "",
    pickupWindowEnd: "",
    deliveryWindowStart: "",
    deliveryWindowEnd: "",
    rate: "", miles: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [dispatchers, setDispatchers] = useState<Array<{ id: string; name: string }>>([]);
  const [drivers, setDrivers] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingMeta, setLoadingMeta] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    async function loadMeta() {
      try {
        setLoadingMeta(true);
        const api = (import.meta as any).env.VITE_API_URL as string;
        const res = await fetch(`${api}/api/test-data`);
        if (!res.ok) throw new Error(`Failed to load metadata (${res.status})`);
        const data = await res.json();
        if (ignore) return;
        const cos = (data.sample?.companies ?? []) as Array<{ id: string; name: string }>;
        const disps = (data.sample?.users ?? [])
          .filter((u: any) => u.role === "dispatcher")
          .map((u: any) => ({ id: u.id, name: u.name })) as Array<{ id: string; name: string }>;
        const drs = (data.sample?.drivers ?? []) as Array<{ id: string; name: string }>;
        setCompanies(cos);
        setDispatchers(disps);
        setDrivers(drs);

        // Normalize default company id if it doesn't exist in DB (mock ids vs real ids)
        setForm(f => {
          const validCompanyId = cos.some(c => c.id === f.companyId) ? f.companyId : (cos[0]?.id || "");
          return { ...f, companyId: validCompanyId };
        });
      } catch (e: any) {
        if (!ignore) setErr(e.message || "Failed to load metadata");
      } finally {
        if (!ignore) setLoadingMeta(false);
      }
    }
    loadMeta();
    return () => { ignore = true; };
  }, []);

  // Initialize default pickup/delivery dates (prefer board week if provided)
  useEffect(() => {
    setForm(f => {
      if (f.pickupDate && f.deliveryDate) return f;
      const now = new Date();
      const today = new Date(now);
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const toDateInput = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        return `${yyyy}-${mm}-${dd}`;
      };
      return {
        ...f,
        pickupDate: f.pickupDate || defaultPickupDateIso || toDateInput(today),
        deliveryDate: f.deliveryDate || defaultDeliveryDateIso || toDateInput(tomorrow),
      };
    });
  }, [defaultPickupDateIso, defaultDeliveryDateIso]);

  function upd<K extends keyof typeof form>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await createLoad({
        companyId: form.companyId,
        dispatcherId: form.dispatcherId,
        driverId: form.driverId,
        pickupCity: form.pickupCity, pickupState: form.pickupState,
        deliveryCity: form.deliveryCity, deliveryState: form.deliveryState,
        // Send stable UTC noon to avoid timezone date shifts
        pickupAt: form.pickupDate ? new Date(`${form.pickupDate}T12:00:00Z`).toISOString() : undefined,
        deliveryAt: form.deliveryDate ? new Date(`${form.deliveryDate}T12:00:00Z`).toISOString() : undefined,
        pickupWindowStart: form.pickupWindowStart || undefined,
        pickupWindowEnd: form.pickupWindowEnd || undefined,
        deliveryWindowStart: form.deliveryWindowStart || undefined,
        deliveryWindowEnd: form.deliveryWindowEnd || undefined,
        rate: Number(form.rate), miles: Number(form.miles),
      });
      onSuccess();
    } catch (e: any) {
      setErr(e.message || "Failed to create load");
    } finally {
      setBusy(false);
    }
  }

  const filteredDrivers = useMemo(() => drivers, [drivers]);

  return (
    <form onSubmit={submit} className="space-y-3">
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="block text-xs text-gray-600 mb-1">Company</label>
          <select
            className="w-full border rounded px-2 py-1 text-sm"
            value={form.companyId}
            onChange={e=>upd("companyId", e.target.value)}
            disabled={loadingMeta}
          >
            <option value="" disabled>{loadingMeta ? "Loading companies…" : "Select a company"}</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Dispatcher</label>
          <select
            className="w-full border rounded px-2 py-1 text-sm"
            value={form.dispatcherId}
            onChange={e=>upd("dispatcherId", e.target.value)}
            disabled={loadingMeta}
          >
            <option value="">{loadingMeta ? "Loading…" : "Select dispatcher"}</option>
            {dispatchers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Driver</label>
          <select
            className="w-full border rounded px-2 py-1 text-sm"
            value={form.driverId}
            onChange={e=>upd("driverId", e.target.value)}
            disabled={loadingMeta}
          >
            <option value="">{loadingMeta ? "Loading…" : "Select driver"}</option>
            {filteredDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Pickup City</label>
          <input className="w-full border rounded px-2 py-1 text-sm" value={form.pickupCity} onChange={e=>upd("pickupCity", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Pickup State</label>
          <input className="w-full border rounded px-2 py-1 text-sm" maxLength={2} value={form.pickupState} onChange={e=>upd("pickupState", e.target.value.toUpperCase())} />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Pickup Date (MM/DD/YYYY)</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            type="date"
            required
            value={form.pickupDate}
            onChange={e=>upd("pickupDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Pickup Window Start (HH:MM)</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            type="time"
            value={form.pickupWindowStart}
            onChange={e=>upd("pickupWindowStart", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Pickup Window End (HH:MM)</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            type="time"
            value={form.pickupWindowEnd}
            onChange={e=>upd("pickupWindowEnd", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Delivery City</label>
          <input className="w-full border rounded px-2 py-1 text-sm" value={form.deliveryCity} onChange={e=>upd("deliveryCity", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Delivery State</label>
          <input className="w-full border rounded px-2 py-1 text-sm" maxLength={2} value={form.deliveryState} onChange={e=>upd("deliveryState", e.target.value.toUpperCase())} />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Delivery Date (MM/DD/YYYY)</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            type="date"
            required
            value={form.deliveryDate}
            onChange={e=>upd("deliveryDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Delivery Window Start (HH:MM)</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            type="time"
            value={form.deliveryWindowStart}
            onChange={e=>upd("deliveryWindowStart", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Delivery Window End (HH:MM)</label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            type="time"
            value={form.deliveryWindowEnd}
            onChange={e=>upd("deliveryWindowEnd", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Rate (USD)</label>
          <input className="w-full border rounded px-2 py-1 text-sm" type="number" step="0.01" value={form.rate} onChange={e=>upd("rate", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Miles</label>
          <input className="w-full border rounded px-2 py-1 text-sm" type="number" step="1" value={form.miles} onChange={e=>upd("miles", e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="px-3 py-1 rounded border" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-60" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
