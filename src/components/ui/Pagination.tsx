'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'

import { PAGE_SIZE_OPTIONS, parsePageSize } from '@/lib/pagination'
import type { PaginationMeta } from '@/lib/types'

/**
 * Page controls for the three list endpoints. They take `page` and `limit` and
 * nothing else — there is no sorting or filtering to preserve in the URL.
 */
export function Pagination({ meta, basePath }: { meta: PaginationMeta; basePath: string }) {
  const router = useRouter()

  if (meta.total === 0) return null

  const from = (meta.page - 1) * meta.limit + 1
  const to = Math.min(meta.page * meta.limit, meta.total)

  function handleLimitChange(event: ChangeEvent<HTMLSelectElement>) {
    const limit = parsePageSize(event.target.value)
    router.push(`${basePath}?page=1&limit=${limit}`)
  }

  return (
    <nav className="pagination" aria-label="Paginación">
      <p className="pagination-info">
        {from}–{to} de {meta.total} · Página {meta.page} de {meta.totalPages}
      </p>

      <div className="pagination-actions">
        <label className="pagination-page-size">
          <span>Elementos por página</span>
          <select
            key={meta.limit}
            className="field-select"
            defaultValue={meta.limit}
            onChange={handleLimitChange}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="pagination-controls">
          <PageLink
            href={`${basePath}?page=${meta.page - 1}&limit=${meta.limit}`}
            enabled={meta.hasPreviousPage}
            label="Anterior"
          />
          <PageLink
            href={`${basePath}?page=${meta.page + 1}&limit=${meta.limit}`}
            enabled={meta.hasNextPage}
            label="Siguiente"
          />
        </div>
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
