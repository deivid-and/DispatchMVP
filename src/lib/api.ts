export type BoardLoad = {
  id: string; companyId: string; dispatcherId: string; driverId: string;
  deliveryDate: string | null; deliveryCity: string; deliveryState: string;
  pickupCity: string; pickupState: string; loadNumber?: string | null;
  brokerName?: string | null; status: string; rate: number; miles: number; deadhead: number; rpm: number;
  driver: { id: string; name: string }; dispatcher: { id: string; name: string }; company: { id: string; name: string };
};
export type BoardResponse = { range: { start: string; end: string }; count: number; loads: BoardLoad[] };

const API = (import.meta as any).env.VITE_API_URL as string;

export async function getBoard(start: string, end: string, params?: { companyId?: string; dispatcherId?: string }): Promise<BoardResponse> {
  const q = new URLSearchParams({ start, end, ...(params || {}) });
  const res = await fetch(`${API}/api/board?${q.toString()}`);
  if (!res.ok) throw new Error(`Board fetch failed: ${res.status}`);
  return res.json();
}



export type CreateLoad = {
  companyId: string; dispatcherId: string; driverId: string;
  pickupCity: string; pickupState: string;
  deliveryCity: string; deliveryState: string;
  rate: number; miles: number; deadhead?: number;
  loadNumber?: string; brokerName?: string; brokerMcNumber?: string;
  pickupAt?: string; deliveryAt?: string; status?: string;
  pickupWindowStart?: string; pickupWindowEnd?: string;
  deliveryWindowStart?: string; deliveryWindowEnd?: string;
};

export async function createLoad(body: CreateLoad): Promise<BoardLoad> {
  const res = await fetch(`${API}/api/loads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Create load failed: ${res.status}`);
  return res.json();
}
