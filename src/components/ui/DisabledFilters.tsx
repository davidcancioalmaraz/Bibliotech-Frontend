interface FilterOption {
  value: string
  label: string
}

/**
 * The filter bar from the original mockup, kept for its layout and disabled on
 * purpose: the list endpoints accept `page` and `limit` and nothing else, and
 * the API's `ValidationPipe` runs with `forbidNonWhitelisted`, so an unknown
 * query parameter answers 400 rather than being ignored.
 *
 * Searching and filtering land when the backend grows them.
 */
export function DisabledFilters({
  searchPlaceholder,
  select,
}: {
  searchPlaceholder: string
  select: { id: string; label: string; options: FilterOption[] }
}) {
  return (
    <div className="filters">
      <div className="filter-field filter-field-wide">
        <label className="field-label" htmlFor="search">
          Buscar
        </label>
        <input
          className="field-input"
          type="search"
          id="search"
          name="search"
          placeholder={searchPlaceholder}
          disabled
          title="La búsqueda aún no está disponible en la API"
        />
      </div>

      <div className="filter-field">
        <label className="field-label" htmlFor={select.id}>
          {select.label}
        </label>
        <select
          className="field-select"
          id={select.id}
          name={select.id}
          disabled
          title="El filtrado aún no está disponible en la API"
        >
          {select.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
