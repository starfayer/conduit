interface PaginationProps {
  currentPage: number,
  setCurrentPage: (page: number) => any,
  pageAmount: number
}

export function Pagination({currentPage, setCurrentPage, pageAmount}: PaginationProps) {
  return (
    <ul className="pagination">
      {pageAmount > 0 && Array(pageAmount)
        .fill(null)
        .map((_, index) =>
          index + 1 === currentPage ? (
            <li key={index} className="page-item active">
              <span className="page-link">{index + 1}</span>
            </li>
          ) : (
            <li key={index} className="page-item">
              <button
                className="page-link"
                name="page"
                value={index + 1}
                onClick={() => setCurrentPage(index+1)}
              >
                {index + 1}
              </button>
            </li>
          ),
        )
      }
    </ul>
  )
}