import { CheckIcon } from "lucide-react";
import React from "react";

import { cn } from "~/core/lib/utils";

export default function CreatePagination({
  pageSize,
  currentPage,
}: {
  pageSize: number;
  currentPage: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array(pageSize)
        .fill(0)
        .map((v, idx) => (
          <React.Fragment key={`page_${idx}`}>
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full",
                currentPage === idx + 1
                  ? "bg-primary text-primary-foreground"
                  : currentPage < idx + 1
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground bg-green-400",
              )}
            >
              {currentPage <= idx + 1 ? idx + 1 : <CheckIcon size={20} />}
            </div>
            {pageSize > idx + 1 && <div className="bg-accent h-1 w-10" />}
          </React.Fragment>
        ))}
    </div>
  );
}
