/** Page sizes offered by the three list views. */
export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0]

/** Clamps a `?page=` search param to something the API will accept. */
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number(raw)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

/** Only page sizes exposed by the UI are accepted from the URL. */
export function parsePageSize(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const pageSize = Number(raw)
  return PAGE_SIZE_OPTIONS.find((option) => option === pageSize) ?? DEFAULT_PAGE_SIZE
}
