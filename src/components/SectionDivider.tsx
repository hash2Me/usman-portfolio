export default function SectionDivider() {
  return (
    <div className="w-full overflow-hidden flex items-center justify-center py-8 opacity-20 pointer-events-none select-none">
      <div className="w-full flex justify-between px-10 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="text-black font-black text-2xl">
            +
          </span>
        ))}
      </div>
    </div>
  );
}
