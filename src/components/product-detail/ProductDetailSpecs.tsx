export function ProductDetailSpecs({ specs }: { specs: string[] }) {
  return (
    <ul className="mt-8 space-y-2 border-t border-slate-100 pt-6">
      {specs.map((s, i) => (
        <li
          key={`${i}-${s}`}
          className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
          {s}
        </li>
      ))}
    </ul>
  )
}
