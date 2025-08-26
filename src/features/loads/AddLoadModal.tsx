import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode; // future form fields
};

export default function AddLoadModal({ open, onClose, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Add New Load</h3>
          <button className="text-gray-500 hover:text-red-600" onClick={onClose} type="button">✖</button>
        </div>
        <div className="text-sm text-gray-600 mb-3">Form goes here (next step).</div>
        {children}
        <div className="mt-3 flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={onClose} type="button">Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white" type="button" disabled>Save</button>
        </div>
      </div>
    </div>
  );
}
