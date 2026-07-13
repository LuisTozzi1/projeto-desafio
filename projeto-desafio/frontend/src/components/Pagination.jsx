export default function Pagination({ page, totalPages, totalElements, onPageChange }) {
  if (totalElements === 0) return null;

  const paginas = [];
  const inicio = Math.max(0, page - 2);
  const fim = Math.min(totalPages - 1, page + 2);

  for (let i = inicio; i <= fim; i++) {
    paginas.push(i);
  }

  return (
    <div className="pagination" data-cy="pagination">
      <span>
        {totalElements} registro{totalElements === 1 ? '' : 's'} — página {page + 1} de {Math.max(totalPages, 1)}
      </span>
      <div className="pagination-controls">
        <button onClick={() => onPageChange(0)} disabled={page === 0} aria-label="Primeira página">
          «
        </button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 0} aria-label="Página anterior">
          ‹
        </button>
        {paginas.map((p) => (
          <button
            key={p}
            className={p === page ? 'active' : ''}
            onClick={() => onPageChange(p)}
            data-cy={`page-${p + 1}`}
          >
            {p + 1}
          </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1} aria-label="Próxima página">
          ›
        </button>
        <button onClick={() => onPageChange(totalPages - 1)} disabled={page >= totalPages - 1} aria-label="Última página">
          »
        </button>
      </div>
    </div>
  );
}
