"use client";

import { useEffect, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

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

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? itemsLength + 1 : itemsLength,
    getScrollElement: () => window,
    estimateSize: () => 100,
    overscan: 10,
    // FIXME: Kind of a hacky magic number to account for the header
    paddingStart: 150,
  });

  const lastItemIndex = [...rowVirtualizer.getVirtualItems()].reverse()[0]
    .index;

  useEffect(() => {
    if (!lastItemIndex) {
      return;
    }

    if (lastItemIndex >= items.length - 1 && hasNextPage && !isLoading) {
      setIsLoading(true);
      loadMoreAction(cursor)
        .then(({ cursor, chunk }) => {
          setCursor(cursor);
          setItems((items) => [...items, ...chunk]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    cursor,
    hasNextPage,
    isLoading,
    items.length,
    loadMoreAction,
    lastItemIndex,
  ]);

  return (
    <div style={{ height: "100%" }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const isLoaderRow = virtualRow.index > itemsLength - 1;
        const item = items[virtualRow.index];

        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
            ref={rowVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {isLoaderRow ? (
              hasNextPage ? (
                "Loading more..."
              ) : (
                "Nothing more to load"
              )
            ) : (
              <div>{item}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
