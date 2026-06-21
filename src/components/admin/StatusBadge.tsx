export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    completed: "bg-green-500/15 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}
