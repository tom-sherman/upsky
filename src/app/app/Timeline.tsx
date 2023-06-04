"use client";

import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import "./styles.css";

interface TimelineProps {
  initialChunk: React.ReactNode[];
  initialCursor?: string;
  loadMoreAction: (cursor?: string) => Promise<{
    cursor?: string;
    chunk: React.ReactNode[];
  }>;
}

export function Timeline({
  initialChunk,
  loadMoreAction,
  initialCursor,
}: TimelineProps) {
  const [items, setItems] = useState(initialChunk);
  const itemsLength = items.length;
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const hasNextPage = !!cursor;
  const parentRef = useRef(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? itemsLength + 1 : itemsLength,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const observer = new IntersectionObserver(([entry]) => {
      console.log({
        "entry.isIntersecting": entry.isIntersecting,
        hasNextPage,
        "element?.getAttribute('data-disabled')":
          loadMoreRef.current?.getAttribute("data-disabled"),
      });
      if (
        entry.isIntersecting &&
        hasNextPage &&
        loadMoreRef.current?.getAttribute("data-disabled") !== "true"
      ) {
        setIsLoading(true);
        loadMoreAction(cursor)
          .then(({ chunk, cursor }) => {
            if (abortController.signal.aborted) {
              return;
            }

            setItems((items) => [...items, ...chunk]);
            setCursor(cursor);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });

    const element = loadMoreRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      abortController.abort();
      if (element) {
        observer.unobserve(element);
      }
    };
  });

  return (
    <div
      ref={parentRef}
      className="List"
      style={{
        height: `500px`,
        width: `100%`,
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > itemsLength - 1;
          const item = items[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div
                  ref={loadMoreRef}
                  data-disabled={isLoading || !hasNextPage}
                >
                  {hasNextPage ? "Loading more..." : "Nothing more to load"}
                </div>
              ) : (
                <div>{item}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
