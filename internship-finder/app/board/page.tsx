import KanbanBoard from "@/components/KanbanBoard";

export default function BoardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          My board
        </h1>
        <p className="mt-1 text-ink/60">
          Drag a card between columns, or use the dropdown on mobile.
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}
