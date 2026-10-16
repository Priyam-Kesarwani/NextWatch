import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronLeft, 
    faChevronRight, 
    faAnglesLeft, 
    faAnglesRight 
} from '@fortawesome/free-solid-svg-icons';

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems = 0,
    pageSize = 12,
    onPageSizeChange,
    pageSizeOptions = [12, 24, 48],
    isLoading = false
}) => {
    // If there's 1 or 0 total pages and no items, don't show pagination
    if (totalPages <= 1 && totalItems <= pageSize) {
        return null;
    }

    const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));
    const startItem = totalItems > 0 ? (safePage - 1) * pageSize + 1 : 0;
    const endItem = totalItems > 0 ? Math.min(safePage * pageSize, totalItems) : 0;

    // Generate visible page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include page 1
            pages.push(1);

            let start = Math.max(2, safePage - 1);
            let end = Math.min(totalPages - 1, safePage + 1);

            if (safePage <= 3) {
                end = 4;
            } else if (safePage >= totalPages - 2) {
                start = totalPages - 3;
            }

            if (start > 2) {
                pages.push('dots-prev');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push('dots-next');
            }

            // Always include last page
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageClick = (page) => {
        if (page === safePage || isLoading) return;
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="w-full max-w-6xl mx-auto px-4 my-8">
            <div className="bg-card/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Result count & Page size selector */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    {totalItems > 0 ? (
                        <span>
                            Showing <span className="text-primary font-semibold">{startItem}</span> to{' '}
                            <span className="text-primary font-semibold">{endItem}</span> of{' '}
                            <span className="text-white font-bold">{totalItems}</span> movies
                        </span>
                    ) : (
                        <span>
                            Page <span className="text-primary font-semibold">{safePage}</span> of{' '}
                            <span className="text-white font-bold">{totalPages}</span>
                        </span>
                    )}

                    {typeof onPageSizeChange === 'function' && (
                        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                            <label htmlFor="page-size-select" className="text-xs text-gray-400 uppercase tracking-wider">
                                Per page:
                            </label>
                            <select
                                id="page-size-select"
                                value={pageSize}
                                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                                disabled={isLoading}
                                className="bg-darker/80 text-white text-xs rounded-lg px-2.5 py-1.5 border border-white/15 focus:border-primary focus:outline-none transition-colors cursor-pointer"
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Page Navigation Controls */}
                <nav aria-label="Movies pagination" className="flex items-center gap-1 sm:gap-2">
                    {/* First Page Button */}
                    <button
                        onClick={() => handlePageClick(1)}
                        disabled={safePage === 1 || isLoading}
                        aria-label="First page"
                        title="First page"
                        className="px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border border-white/10 
                            hover:border-primary/40 hover:bg-white/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-transparent text-gray-300"
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </button>

                    {/* Previous Page Button */}
                    <button
                        onClick={() => handlePageClick(safePage - 1)}
                        disabled={safePage === 1 || isLoading}
                        aria-label="Previous page"
                        title="Previous page"
                        className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border border-white/10 
                            hover:border-primary/40 hover:bg-white/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-transparent text-gray-300 flex items-center gap-1.5"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1">
                        {pageNumbers.map((p, index) => {
                            if (p === 'dots-prev' || p === 'dots-next') {
                                return (
                                    <span
                                        key={`${p}-${index}`}
                                        className="px-2 py-1 text-gray-500 font-semibold select-none text-xs sm:text-sm"
                                    >
                                        •••
                                    </span>
                                );
                            }

                            const isActive = p === safePage;

                            return (
                                <button
                                    key={p}
                                    onClick={() => handlePageClick(p)}
                                    disabled={isLoading}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={`Page ${p}`}
                                    className={`min-w-[34px] sm:min-w-[38px] h-[34px] sm:h-[38px] px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center ${
                                        isActive
                                            ? 'bg-gradient-to-r from-primary to-cyan-400 text-darker font-bold shadow-lg shadow-primary/30 ring-2 ring-primary/40 scale-105'
                                            : 'border border-white/10 hover:border-primary/40 hover:bg-white/10 text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Page Button */}
                    <button
                        onClick={() => handlePageClick(safePage + 1)}
                        disabled={safePage === totalPages || isLoading}
                        aria-label="Next page"
                        title="Next page"
                        className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border border-white/10 
                            hover:border-primary/40 hover:bg-white/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-transparent text-gray-300 flex items-center gap-1.5"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>

                    {/* Last Page Button */}
                    <button
                        onClick={() => handlePageClick(totalPages)}
                        disabled={safePage === totalPages || isLoading}
                        aria-label="Last page"
                        title="Last page"
                        className="px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border border-white/10 
                            hover:border-primary/40 hover:bg-white/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-transparent text-gray-300"
                    >
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Pagination;
