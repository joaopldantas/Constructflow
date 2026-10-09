export function Spinner({ size = 20, label }: { size?: number; label?: string }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size }}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}

export function PageLoader({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="page-loader">
      <Spinner size={28} label={label} />
    </div>
  )
}
