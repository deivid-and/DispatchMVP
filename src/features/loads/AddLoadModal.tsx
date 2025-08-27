import React, { type ReactNode } from "react";

type Props = { open: boolean; onClose: () => void; title?: string; children?: ReactNode };

export default function AddLoadModal({ open, onClose, title = "Add New Load", children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-gray-500 hover:text-red-600" onClick={onClose} type="button">✖</button>
        </div>
        {children}
      </div>
    </div>
  );
}
