import Link from 'next/link'
import type { ReactNode } from 'react'

/** The white card the tables and forms sit in. */
export function Panel({ children }: { children: ReactNode }) {
  return <section className="panel">{children}</section>
}

export function PanelHeader({
  title,
  action,
}: {
  title: string
  action?: { label: string; href: string }
}) {
  return (
    <header className="panel-header">
      <h2 className="panel-title">{title}</h2>
      {action ? (
        <Link className="panel-action" href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </header>
  )
}

/** Page title, subtitle and the primary action of the section. */
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}
