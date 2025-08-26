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
