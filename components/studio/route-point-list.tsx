"use client";

import { GripVertical, Trash2 } from "lucide-react";

import type { RoutePoint } from "@/lib/types";

type RoutePointListProps = {
  points: RoutePoint[];
  onDelete: (id: string) => void;
  onReorder: (next: RoutePoint[]) => void;
};

export function RoutePointList({ points, onDelete, onReorder }: RoutePointListProps) {
  const onDragStart = (
    event: React.DragEvent<HTMLLIElement>,
    draggedId: string,
  ): void => {
    event.dataTransfer.setData("text/plain", draggedId);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (
    event: React.DragEvent<HTMLLIElement>,
    targetId: string,
  ): void => {
    const draggedId = event.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) {
      return;
    }

    const from = points.findIndex((point) => point.id === draggedId);
    const to = points.findIndex((point) => point.id === targetId);

    if (from < 0 || to < 0) {
      return;
    }

    const reordered = [...points];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onReorder(reordered);
  };

  return (
    <ul className="space-y-2" aria-label="Route points">
      {points.map((point, index) => (
        <li
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#0b2236] px-3 py-2"
          draggable
          key={point.id}
          onDragOver={(event) => event.preventDefault()}
          onDragStart={(event) => onDragStart(event, point.id)}
          onDrop={(event) => onDrop(event, point.id)}
        >
          <GripVertical className="h-4 w-4 text-[#89a3bf]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">Stop {index + 1}</p>
            <p className="truncate text-xs text-[#8fa8c2]">
              {point.lat.toFixed(3)}, {point.lng.toFixed(3)}
            </p>
          </div>
          <button
            aria-label={`Delete stop ${index + 1}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-[#b7cde3] hover:bg-white/10 hover:text-white"
            onClick={() => onDelete(point.id)}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
