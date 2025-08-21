import type { LoadStatus } from '../../../types/domain';

export const statusColor: Record<LoadStatus, string> = {
  Ready: "bg-red-100 text-red-700 border-red-300",
  Transit: "bg-yellow-100 text-yellow-800 border-yellow-300",
  HT: "bg-pink-100 text-pink-700 border-pink-300",
  Late: "bg-amber-200 text-amber-900 border-amber-400",
};

export const statusBarColor: Record<LoadStatus, string> = {
  Ready: "bg-red-500",
  Transit: "bg-yellow-300",
  HT: "bg-pink-400",
  Late: "bg-amber-700",
};

export function getStatusStyles(status: LoadStatus): { container: string; bar: string } {
  return {
    container: statusColor[status] || "bg-gray-100 text-gray-500 border-gray-200",
    bar: statusBarColor[status] || "bg-gray-200"
  };
}
