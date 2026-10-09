export function Logo() {
  return (
    <span className="logo">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
        <rect width="32" height="32" rx="8" fill="var(--brand)" />
        <path d="M8 23V13l8-5 8 5v10h-5v-6h-6v6z" fill="#fff" />
      </svg>
      <span>ConstructFlow</span>
    </span>
  )
}
