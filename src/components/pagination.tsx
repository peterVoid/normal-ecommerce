import { cn } from "@/lib/utils";
import Link from "next/link";

interface PaginationProps {
  page?: string;
  totalPages: number;
  hasNextPage?: boolean;
  maxWindow?: number;
}

type PageItem = number | "ellipsis";

function getPagesToShow(
  totalPages: number,
  currentPage: number,
  maxWindow: number = 5
): PageItem[] {
  // guard
  totalPages = Math.max(1, Math.floor(totalPages));
  currentPage = Math.min(Math.max(Number(currentPage), 1), totalPages);
  maxWindow = Math.max(1, Math.floor(maxWindow));

  if (totalPages <= maxWindow) {
    // small number of pages -> show all -> [1,2,3,4,5]
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxWindow / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  // adjust when out of bounds
  if (start < 1) {
    start = 1;
    end = Math.min(totalPages, start + maxWindow - 1);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, totalPages - maxWindow + 1);
  }

  const pages: PageItem[] = [];

  // Always include first page (maybe)
  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push("ellipsis");
    }
  }

  for (let p = start; p <= end; p++) pages.push(p);

  // Maybe ellipsis then last
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination(props: PaginationProps) {
  const { page = "1", totalPages, hasNextPage, maxWindow = 5 } = props;
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);

  //   fallback for hasNextPage if not provided
  const derivedHasNext =
    typeof hasNextPage === "boolean" ? hasNextPage : currentPage < totalPages;

  const pages = getPagesToShow(totalPages, currentPage, maxWindow);

  return (
    <div className="flex items-center justify-center space-x-3">
      <Link
        href={`?page=${currentPage - 1}`}
        className={cn(
          "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
          currentPage === 1 && "pointer-events-none opacity-50 bg-gray-100"
        )}
        aria-label="Previous page"
      >
        Previous
      </Link>

      <nav
        aria-label="Pagination"
        className="inline-flex -space-x-px rounded-md"
      >
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              &hellip;
            </span>
          ) : (
            <Link
              key={p}
              href={`?page=${p}`}
              className={cn(
                "relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50",
                p === currentPage ? "pointer-events-none bg-gray-100" : "",
                i === 0 ? "rounded-l-md" : "",
                i === pages.length - 1 ? "rounded-r-md" : ""
              )}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </Link>
          )
        )}
      </nav>

      <Link
        href={`?page=${currentPage + 1}`}
        className={cn(
          "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
          !derivedHasNext ? "pointer-events-none bg-gray-100" : ""
        )}
        aria-label="Next page"
      >
        Next
      </Link>
    </div>
  );
}
