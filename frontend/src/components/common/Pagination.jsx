import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from '../forms/Button';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showFirstLast = true,
  maxVisiblePages = 5 
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);
    
    for (let i = adjustedStartPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination">
      <div className="pagination-controls">
        {showFirstLast && (
          <Button
            variant="outline"
            size="small"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            First
          </Button>
        )}
        
        <Button
          variant="outline"
          size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FaChevronLeft />
          Previous
        </Button>

        <div className="pagination-numbers">
          {visiblePages[0] > 1 && (
            <>
              <Button
                variant="outline"
                size="small"
                onClick={() => handlePageChange(1)}
              >
                1
              </Button>
              {visiblePages[0] > 2 && <span className="pagination-ellipsis">...</span>}
            </>
          )}

          {visiblePages.map(page => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'outline'}
              size="small"
              onClick={() => handlePageChange(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </Button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <Button
                variant="outline"
                size="small"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
          <FaChevronRight />
        </Button>

        {showFirstLast && (
          <Button
            variant="outline"
            size="small"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            Last
          </Button>
        )}
      </div>

      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
