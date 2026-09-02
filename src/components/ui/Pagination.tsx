import Link from 'next/link'

import type { PaginationMeta } from '@/lib/types'

/**
 * Page controls for the three list endpoints. They take `page` and `limit` and
 * nothing else — there is no sorting or filtering to preserve in the URL.
 */
export function Pagination({ meta, basePath }: { meta: PaginationMeta; basePath: string }) {
  if (meta.total === 0) return null

  const from = (meta.page - 1) * meta.limit + 1
  const to = Math.min(meta.page * meta.limit, meta.total)

  return (
    <nav className="pagination" aria-label="Paginación">
      <p className="pagination-info">
        {from}–{to} de {meta.total} · Página {meta.page} de {meta.totalPages}
      </p>

      <div className="pagination-controls">
        <PageLink
          href={`${basePath}?page=${meta.page - 1}`}
          enabled={meta.hasPreviousPage}
          label="Anterior"
        />
        <PageLink
          href={`${basePath}?page=${meta.page + 1}`}
          enabled={meta.hasNextPage}
          label="Siguiente"
        />
      </div>
    </nav>
  )
}

/** A disabled control renders as a span: there is no page to link to. */
function PageLink({
  href,
  enabled,
  label,
}: {
  href: string
  enabled: boolean
  label: string
}) {
  if (!enabled)
    return (
      <span className="btn btn-secondary btn-sm" aria-disabled="true">
        {label}
      </span>
    )

  return (
    <Link className="btn btn-secondary btn-sm" href={href}>
      {label}
    </Link>
  )
}
