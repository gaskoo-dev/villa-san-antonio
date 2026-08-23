import { IconStarFilled } from '@tabler/icons-react'

export function Stars({
  count = 5,
  size = 18,
  className = '',
}: {
  count?: number
  size?: number
  className?: string
}) {
  const safe = Math.max(0, Math.min(5, count))
  return (
    <span className={`inline-flex items-center gap-0.5 text-amber-700 ${className}`} aria-label={`${safe} out of 5 stars`}>
      {Array.from({ length: safe }).map((_, i) => (
        <IconStarFilled key={i} size={size} className="text-amber-700" />
      ))}
    </span>
  )
}
